import { Router } from 'express';
import {
  handleCheckout,
  getBookingsList,
  getBookingById,
  cancelBooking
} from '../controllers/bookingController';
import { checkAuth } from '../middleware/auth';

const bookingsRouter = Router();

// all booking routes are protected
bookingsRouter.post('/checkout', checkAuth, handleCheckout);
bookingsRouter.get('/', checkAuth, getBookingsList);
bookingsRouter.get('/:id', checkAuth, getBookingById);
bookingsRouter.post('/:id/cancel', checkAuth, cancelBooking);

export default bookingsRouter;