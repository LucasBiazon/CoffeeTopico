import { Router } from 'express';
import authRoutes from './auth.routes.js';
import coffeesRoutes from './coffees.routes.js';
import profilesRoutes from './profiles.routes.js';
import reviewsRoutes from './reviews.routes.js';
import recommendationsRoutes from './recommendations.routes.js';
import favoritesRoutes from './favorites.routes.js';
import recsRoutes from './recs.routes.js';

const r = Router();

r.use('/auth', authRoutes);
r.use('/coffees', coffeesRoutes);
r.use('/profiles', profilesRoutes);
r.use('/coffees/:id/reviews', reviewsRoutes);
r.use('/favorites', favoritesRoutes);
r.use('/recs', recsRoutes);

export default r;
