import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

export const handleSignup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // basic check before doing anything
    if (!name || !email || !password) {
      return res.status(400).json({ statusCode: 400, message: 'Name, email and password are all required' });
    }

    // password length check
    if (password.length < 6) {
      return res.status(400).json({ statusCode: 400, message: 'Password should be at least 6 characters' });
    }

    const result = await registerUser(name, email, password);
    return res.status(201).json(result);

  } catch (error: any) {
    return res.status(error.status || 500).json({ 
      statusCode: error.status || 500, 
      message: error.message || 'Something went wrong' 
    });
  }
};

export const handleLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ statusCode: 400, message: 'Email and password are required' });
    }

    const result = await loginUser(email, password);
    return res.status(200).json(result);

  } catch (error: any) {
    return res.status(error.status || 500).json({ 
      statusCode: error.status || 500, 
      message: error.message || 'Something went wrong' 
    });
  }
};

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    // fetch user but hide the password field
    const myProfile = await User.findById(req.userId).select('-password');

    if (!myProfile) {
      return res.status(404).json({ statusCode: 404, message: 'User not found' });
    }

    return res.status(200).json(myProfile);

  } catch (error: any) {
    return res.status(500).json({ 
      statusCode: 500, 
      message: error.message || 'Something went wrong' 
    });
  }
};