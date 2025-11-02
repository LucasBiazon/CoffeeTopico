import { Router } from 'express';
import authRoutes from './auth.routes.js';
import coffeesRoutes from './coffees.routes.js';
import profilesRoutes from './profiles.routes.js';
import reviewsRoutes from './reviews.routes.js';

const r = Router();

r.use('/auth', authRoutes);
r.use('/coffees', coffeesRoutes);
r.use('/profiles', profilesRoutes);
r.use('/coffees/:id/reviews', reviewsRoutes);

export default r;
