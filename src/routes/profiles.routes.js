import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { getMyProfile, upsertMyProfile } from '../controllers/profiles.controller.js';

const r = Router();
r.get('/me', auth(), getMyProfile);
r.put('/me', auth(), upsertMyProfile);
export default r;
