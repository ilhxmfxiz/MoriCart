import Cart from '../models/Cart';
import Service from '../models/Service';

export const getUserCart = async (userId: string) => {
  // get cart with service details populated
  let foundCart = await Cart.findOne({ owner: userId }).populate('items.service');

  // if no cart exists yet, create an empty one
  if (!foundCart) {
    foundCart = await Cart.create({ owner: userId, items: [] });
  }

  return foundCart;
};

export const addItemToCart = async (
  userId: string,
  serviceId: string,
  selectedDate: string,
  selectedTime: string,
) => {
  // check if service actually exists
  const foundService = await Service.findById(serviceId);
  if (!foundService) throw { status: 404, message: 'Service not found' };

  let foundCart = await Cart.findOne({ owner: userId });
  // no cart found, create a fresh one for this user
  if (!foundCart) {
    foundCart = await Cart.create({ owner: userId, items: [] });
  }

  // check if same service with same slot already in cart
  const alreadyInCart = foundCart.items.find(
    (item) =>
      item.service.toString() === serviceId &&
      item.selectedDate === selectedDate &&
      item.selectedTime === selectedTime,
  );

  if (alreadyInCart) {
    throw { status: 400, message: 'This service is already in your cart for the same slot' };
  }

  // add the new item
  foundCart.items.push({
    service: new (require('mongoose').Types.ObjectId)(serviceId),
    selectedDate,
    selectedTime,
    quantity: 1,
    priceAtAdding: foundService.price,
  });

  // reset cart expiry every time something is added
  foundCart.expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await foundCart.save();

  return await Cart.findOne({ owner: userId }).populate('items.service');
};

export const updateCartItem = async (
  userId: string,
  itemId: string,
  selectedDate?: string,
  selectedTime?: string,
) => {
  const foundCart = await Cart.findOne({ owner: userId });
  if (!foundCart) throw { status: 404, message: 'Cart not found' };

  const cartItem = foundCart.items.find((item) => item._id?.toString() === itemId);
  if (!cartItem) throw { status: 404, message: 'Item not found in cart' };

  // update only what was sent
  if (selectedDate) cartItem.selectedDate = selectedDate;
  if (selectedTime) cartItem.selectedTime = selectedTime;

  await foundCart.save();
  return await Cart.findOne({ owner: userId }).populate('items.service');
};

export const removeCartItem = async (userId: string, itemId: string) => {
  const userCart = await Cart.findOne({ owner: userId });
  if (!userCart) throw { status: 404, message: 'Cart not found' };

  // filter out the item we want to remove
  const beforeCount = userCart.items.length;
  userCart.items = userCart.items.filter((item) => item._id?.toString() !== itemId);

  if (userCart.items.length === beforeCount) {
    throw { status: 404, message: 'Item not found in cart' };
  }

  await userCart.save();
  return await Cart.findOne({ owner: userId }).populate('items.service');
};