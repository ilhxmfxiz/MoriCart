import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const secret = process.env.JWT_SECRET || 'fallback_secret';

export const registerUser = async (name: string, email: string, password: string) => {
  // check if someone already signed up with this email
  const emailExists = await User.findOne({ email });
  if (emailExists) throw { status: 409, message: 'This email is already registered' };

  // hash the password before saving
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: passwordHash });

  // generate token for immediate login after signup
  const accessToken = jwt.sign({ id: newUser._id }, secret, { expiresIn: '24h' });

  return {
    accessToken,
    userInfo: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email
    }
  };
};

export const loginUser = async (email: string, password: string) => {
  // find the user first
  const existingUser = await User.findOne({ email });
  if (!existingUser) throw { status: 401, message: 'Wrong email or password' };

  // compare what they typed with the stored hash
  const passwordMatches = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatches) throw { status: 401, message: 'Wrong email or password' };

  const accessToken = jwt.sign({ id: existingUser._id }, secret, { expiresIn: '24h' });

  return {
    accessToken,
    userInfo: {
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email
    }
  };
};