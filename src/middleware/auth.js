import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';

export function auth(required = true) {
  return async (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      if (!required) return next();
      return res.status(401).json({ error: 'token ausente' });
    }
    try {
      const payload = jwt.verify(token, env.jwtSecret);
      const user = await User.findById(payload.sub).lean();
      if (!user) return res.status(401).json({ error: 'usuário inválido' });
      req.user = { id: user._id.toString(), role: user.role };
      next();
    } catch {
      return res.status(401).json({ error: 'token inválido' });
    }
  };
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'forbidden' });
    }
    next();
  };
}
