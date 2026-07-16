import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as bookingService from '../services/bookingService';

export const handleCheckout = async (req: AuthRequest, res: Response) => {
  try {
    const { paymentMethod } = req.body;

    // default to cash if nothing specified
    const selectedPaymentMethod = paymentMethod || 'cash';

    const newBookings = await bookingService.checkoutCart(
      req.userId!,
      selectedPaymentMethod
    );

    return res.status(201).json({
      message: 'Booking confirmed successfully!',
      bookings: newBookings
    });

  } catch (e: any) {
    return res.status(e.status || 500).json({
      statusCode: e.status || 500,
      message: e.message || 'Something went wrong'
    });
  }
};

export const getBookingsList = async (req: AuthRequest, res: Response) => {
  try {
    const myBookings = await bookingService.getMyBookings(req.userId!);
    return res.status(200).json(myBookings);
  } catch (error: any) {
    return res.status(error.status || 500).json({
      statusCode: error.status || 500,
      message: error.message || 'Something went wrong'
    });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const bookingId = req.params.id as string;
    const foundBooking = await bookingService.getSingleBooking(req.userId!, bookingId);
    return res.status(200).json(foundBooking);
  } catch (err: any) {
    return res.status(err.status || 500).json({
      statusCode: err.status || 500,
      message: err.message || 'Something went wrong'
    });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const bookingId = req.params.id as string;
    const cancelledBooking = await bookingService.cancelMyBooking(req.userId!, bookingId);

    return res.status(200).json({
      message: 'Booking cancelled successfully',
      booking: cancelledBooking
    });

  } catch (errors: any) {
    return res.status(errors.status || 500).json({
      statusCode: errors.status || 500,
      message: errors.message || 'Something went wrong'
    });
  }
};