import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    email?: string;
    name?: string;
  } | null;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Not authorized, invalid token format' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey_replace_me_in_production';
    const decoded = jwt.verify(token, jwtSecret) as unknown as { id: string };

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401).json({ message: 'Not authorized, user not found' });
      return;
    }

    req.user = {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
