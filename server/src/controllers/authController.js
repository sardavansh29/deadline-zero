import bcrypt from 'bcrypt';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { validateLogin, validateRegister } from '../utils/validation.js';
import { clearSession, establishSession } from '../middleware/auth.js';

const safeUser = (user) => ({ id: user._id, name: user.name, email: user.email, createdAt: user.createdAt });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = validateRegister(req.body);
  if (await User.exists({ email })) throw new AppError('An account with that email already exists.', 409);
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });
  establishSession(res, user);
  res.status(201).json({ success: true, user: safeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = validateLogin(req.body);
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new AppError('Incorrect email or password.', 401);
  establishSession(res, user);
  res.json({ success: true, user: safeUser(user) });
});

export const logout = asyncHandler(async (req, res) => { clearSession(res); res.json({ success: true, message: 'Signed out.' }); });

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError('Your account could not be found.', 401);
  res.json({ success: true, user: safeUser(user) });
});
