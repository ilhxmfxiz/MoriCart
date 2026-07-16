import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as cartService from '../services/cartService';

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const myCart = await cartService.getUserCart(req.userId!);
    return res.status(200).json(myCart);
  } catch (error: any) {
    return res.status(error.status || 500).json({ statusCode: error.status || 500, message: error.message });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { serviceId, selectedDate, selectedTime } = req.body;

    if (!serviceId || !selectedDate || !selectedTime) {
      return res.status(400).json({ statusCode: 400, message: 'serviceId, selectedDate and selectedTime are required' });
    }

    const updatedCart = await cartService.addItemToCart(
      req.userId!,
      serviceId,
      selectedDate,
      selectedTime,
    );

    return res.status(201).json(updatedCart);
  } catch (er: any) {
    return res.status(er.status || 500).json({ statusCode: er.status || 500, message: er.message });
  }
};

export const updateItem = async (req: AuthRequest, res: Response) => {
  try {
    const itemId = req.params.itemId as string;
    const { selectedDate, selectedTime } = req.body;

    const updatedCart = await cartService.updateCartItem(
      req.userId!,
      itemId,
      selectedDate,
      selectedTime,
    );

    return res.status(200).json(updatedCart);
  } catch (error: any) {
    return res.status(error.status || 500).json({ statusCode: error.status || 500, message: error.message });
  }
};

export const removeItem = async (req: AuthRequest, res: Response) => {
  try {
    const itemId = req.params.itemId as string;
    const updatedCart = await cartService.removeCartItem(req.userId!, itemId);
    return res.status(200).json(updatedCart);
  } catch (e: any) {
    return res.status(e.status || 500).json({ statusCode: e.status || 500, message: e.message });
  }
};