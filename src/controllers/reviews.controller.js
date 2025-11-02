import Review from '../models/Review.js';
import Coffee from '../models/Coffee.js';
import { getPagination } from '../utils/pagination.js';

export async function createReview(req, res) {
  const { rating, comment } = req.body || {};
  if (!rating) return res.status(400).json({ error: 'rating é obrigatório' });

  const doc = await Review.create({
    user_id: req.user.id,
    coffee_id: req.params.id,
    rating,
    comment
  });

  const agg = await Review.aggregate([
    {
      $match: {
        coffee_id: doc.coffee_id
      }
    },
    {
      $group: {
        _id: '$coffee_id',
        avg: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);
  const a = agg[0];
  await Coffee.findByIdAndUpdate(doc.coffee_id, {
    rating_avg: a?.avg || 0, rating_count: a?.count || 0
  });

  res.status(201).json(doc);
}

export async function listReviews(req, res) {
  const { page, limit, skip } = getPagination(req.query);
  const coffee_id = req.params.id;
  const [items, total] = await Promise.all([
    Review.find({ coffee_id }).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    Review.countDocuments({ coffee_id })
  ]);
  res.json({ items, total, page, limit });
}
