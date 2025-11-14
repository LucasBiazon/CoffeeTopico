import { Router } from 'express';
import { signup, login, me } from '../controllers/auth.controller.js';
import { auth } from '../middleware/auth.js';

const r = Router();

r.post('/signup', signup);
r.post('/login', login);
r.get('/me', auth(), me);

export default r;
