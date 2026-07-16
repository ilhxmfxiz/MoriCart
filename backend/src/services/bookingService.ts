import mongoose from 'mongoose';
import Booking from '../models/Booking';
import Cart from '../models/Cart';
import Service from '../models/Service';
import SlotCapacity from '../models/SlotCapacity';

// Main checkout flow - converts cart items into actual bookings
export const checkoutCart = async (userId: string, paymentMethod: 'cash' | 'pay_on_arrival' | 'online') => {
  // grab the user's cart with service details
  const activeCart = await Cart.findOne({ owner: userId }).populate('items.service');
  
  if (!activeCart || activeCart.items.length === 0) {
    throw { status: 400, message: 'Your cart is empty' };
  }

  // daily limit check - don't let people hoard all the slots
  // max 3 bookings per day per customer
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todayBookingsCount = await Booking.countDocuments({
    customer: userId,
    createdAt: { $gte: todayStart, $lte: todayEnd },
    status: { $nin: ['cancelled', 'failed'] }  // Only count active bookings
  });

  if (todayBookingsCount + activeCart.items.length > 3) {
    throw { status: 400, message: 'You can only make 3 bookings per day' };
  }

  const createdBookings = [];

  // process each cart item one by one - need to do this sequentially to avoid race conditions
  for (const cartItem of activeCart.items) {
    const serviceDetails = cartItem.service as any;

    // atomic capacity check - this prevents overbooking when two people book at the exact same millisecond
    // findOneAndUpdate with a filter on remaining capacity - MongoDB handles the locking for us
    const slotRecord = await SlotCapacity.findOneAndUpdate(
      {
        service: serviceDetails._id,
        date: cartItem.selectedDate,
        time: cartItem.selectedTime,
        // only update if there's still space available
        $expr: { $lt: ['$bookedCount', '$maxCapacity'] }
      },
      { $inc: { bookedCount: 1 } },
      { new: true }  // return the updated document
    );

    // if slotRecord is null, slot is full or doesn't exist yet
    if (!slotRecord) {
      // check if the slot exists at all
      const existingSlot = await SlotCapacity.findOne({
        service: serviceDetails._id,
        date: cartItem.selectedDate,
        time: cartItem.selectedTime,
      });

      if (existingSlot) {
        // slot exists but it's full - sorry buddy
        throw {
          status: 409,
          message: `Sorry, the ${cartItem.selectedTime} slot for ${serviceDetails.title} on ${cartItem.selectedDate} is fully booked`
        };
      }

      // slot doesn't exist yet, so this is the first booking for this slot
      // create it with bookedCount = 1
      await SlotCapacity.create({
        service: serviceDetails._id,
        date: cartItem.selectedDate,
        time: cartItem.selectedTime,
        bookedCount: 1,
        maxCapacity: serviceDetails.capacityPerSlot,
      });
    }

    // create the booking - starts as pending then we'll confirm it right away for cash payments
    const freshBooking = await Booking.create({
      customer: userId,
      service: serviceDetails._id,
      selectedDate: cartItem.selectedDate,
      selectedTime: cartItem.selectedTime,
      quantity: cartItem.quantity,
      totalPrice: cartItem.priceAtAdding * cartItem.quantity,
      status: 'pending',
      paymentMethod,
      paymentStatus: 'unpaid',
      statusHistory: [{ status: 'pending', changedAt: new Date(), reason: 'Booking created' }]
    });

    // confirm immediately since we're using cash/pay on arrival
    // no need to wait for payment confirmation
    freshBooking.status = 'confirmed';
    freshBooking.paymentStatus = 'unpaid';
    freshBooking.statusHistory.push({
      status: 'confirmed',
      changedAt: new Date(),
      reason: 'Confirmed - cash payment on arrival'
    });

    await freshBooking.save();
    createdBookings.push(freshBooking);
  }

  // clear the cart after successful checkout - they're done shopping
  activeCart.items = [];
  await activeCart.save();

  return createdBookings;
};

// Get all bookings for a specific user, newest first
export const getMyBookings = async (userId: string) => {
  const allBookings = await Booking.find({ customer: userId })
    .populate('service')
    .sort({ createdAt: -1 });  // Most recent at the top
  return allBookings;
};

// Fetch a single booking - also verifies it belongs to this user
export const getSingleBooking = async (userId: string, bookingId: string) => {
  const foundBooking = await Booking.findOne({
    _id: bookingId,
    customer: userId  // Security check: make sure they own this booking
  }).populate('service');

  if (!foundBooking) {
    throw { status: 404, message: 'Booking not found' };
  }

  return foundBooking;
};

// Customer cancels their own booking - frees up the slot for someone else
export const cancelMyBooking = async (userId: string, bookingId: string) => {
  const foundBooking = await Booking.findOne({
    _id: bookingId,
    customer: userId
  });

  if (!foundBooking) {
    throw { status: 404, message: 'Booking not found' };
  }

  // can't cancel what's already done or already cancelled
  if (['cancelled', 'completed', 'failed'].includes(foundBooking.status)) {
    throw { status: 400, message: `Booking is already ${foundBooking.status}` };
  }

  // update status to cancelled
  foundBooking.status = 'cancelled';
  foundBooking.cancelledAt = new Date();
  foundBooking.statusHistory.push({
    status: 'cancelled',
    changedAt: new Date(),
    reason: 'Cancelled by customer'
  });

  await foundBooking.save();

  // release the slot capacity back so someone else can book it
  // important! don't forget this or you'll have "ghost" bookings eating up capacity
  await SlotCapacity.findOneAndUpdate(
    {
      service: foundBooking.service,
      date: foundBooking.selectedDate,
      time: foundBooking.selectedTime,
    },
    { $inc: { bookedCount: -1 } }  // Decrement by 1
  );

  return foundBooking;
};