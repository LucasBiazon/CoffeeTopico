import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';

function toUserDTO(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function generateToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    env.jwtSecret,
    { expiresIn: '7d' }
  );
}

export async function signup(req, res) {
  const { name, email, password, role } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'campos obrigatórios' });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ error: 'email já cadastrado' });
  }

  const user = new User({
    name,
    email,
    role: role || 'user',
  });

  await user.setPassword(password);
  await user.save();

  const token = generateToken(user);

  return res.status(201).json({
    token,
    user: toUserDTO(user),
  });
}

export async function login(req, res) {
  const { email, password } = req.body || {};

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'credenciais inválidas' });
  }

  const ok = await user.validatePassword(password);
  if (!ok) {
    return res.status(401).json({ error: 'credenciais inválidas' });
  }

  const token = generateToken(user);

  return res.json({
    token,
    user: toUserDTO(user),
  });
}

export async function me(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'unauthenticated' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }

    return res.json(toUserDTO(user));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal error' });
  }
}
