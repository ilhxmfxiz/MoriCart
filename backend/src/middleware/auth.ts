import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'fallback_secret';

// extending Request so we can attach userId to it
export interface AuthRequest extends Request {
  userId?: string;
}

export const checkAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // make sure the header exists and starts with Bearer
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ statusCode: 401, message: 'Please login to continue' });
  }

  // pull out the actual token from "Bearer <token>"
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secret) as { id: string };
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ statusCode: 401, message: 'Session expired, please login again' });
  }
};