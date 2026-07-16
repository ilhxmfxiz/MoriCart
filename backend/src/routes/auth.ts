import { Router } from 'express';
import { handleSignup, handleLogin, getMyProfile } from '../controllers/authController';
import { checkAuth } from '../middleware/auth';

const authRouter = Router();

// public routes - no token needed
authRouter.post('/signup', handleSignup);
authRouter.post('/login', handleLogin);

// protected route - must be logged in
authRouter.get('/me', checkAuth, getMyProfile);

export default authRouter;

