import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';

export async function signup(req, res) {
  const { name, email, password, role } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'campos obrigatórios' });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: 'email já cadastrado' });

  const user = new User({ name, email, role: role || 'user' });
  await user.setPassword(password);
  await user.save();

  const token = jwt.sign({
    sub: user._id.toString(),
    role: user.role
  },
    env.jwtSecret, { expiresIn: '7d' }
  );
  res.status(201).json({ Response: "User Created", User: user });
}

export async function login(req, res) {
  const { email, password } = req.body || {};
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'credenciais inválidas' });

  const ok = await user.validatePassword(password);
  if (!ok) return res.status(401).json({ error: 'credenciais inválidas' });

  const token = jwt.sign({
    sub: user._id.toString(),
    role: user.role
  },
    env.jwtSecret, { expiresIn: '7d' }
  );
  res.json({ token, role: user.role });
}
