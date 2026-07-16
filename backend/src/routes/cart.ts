import { Router } from 'express';
import { getCart, addToCart, updateItem, removeItem } from '../controllers/cartController';
import { checkAuth } from '../middleware/auth';

const cartRouter = Router();

// all cart routes are protected - must be logged in
cartRouter.get('/', checkAuth, getCart);
cartRouter.post('/items', checkAuth, addToCart);
cartRouter.patch('/items/:itemId', checkAuth, updateItem);
cartRouter.delete('/items/:itemId', checkAuth, removeItem);

export default cartRouter;
