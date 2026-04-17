import User from '../models/User.js';
import { signToken } from '../services/jwtService.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await user.comparePassword(password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken({ id: user._id, role: user.role });
  return res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};
