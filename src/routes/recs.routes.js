import { Router } from 'express';
import Coffee from '../models/coffee.js';

const router = Router();

router.get('/weather-live', async (req, res, next) => {
  try {
    const total = await Coffee.countDocuments();
    const limit = Number(process.env.MAX_RECS ?? 3);

    if (total === 0) {
      return res.json({ items: [], usedFallback: true, context: {} });
    }

    const skip = Math.max(0, Math.floor(Math.random() * Math.max(total - limit, 0)));
    const items = await Coffee.find().skip(skip).limit(limit).lean();

    res.json({
      items,
      usedFallback: true,
      context: {
        city: req.query.city,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
