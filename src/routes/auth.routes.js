import { Router } from 'express';
import { signup, login } from '../controllers/auth.controller.js';

const r = Router();
r.post('/signup', signup);
r.post('/login', login);
export default r;
