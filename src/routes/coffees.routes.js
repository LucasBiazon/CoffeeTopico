import { Router } from 'express';
import { auth, requireRole } from '../middleware/auth.js';
import {
  createCoffee, listCoffees, getCoffee, updateCoffee, deleteCoffee
} from '../controllers/coffees.controller.js';

const r = Router();
r.get('/', listCoffees);
r.get('/:id', getCoffee);
r.post('/', auth(), requireRole("admin"), createCoffee);
r.patch('/:id', auth(), requireRole('admin'), updateCoffee);
r.delete('/:id', auth(), requireRole('admin'), deleteCoffee);
export default r;
