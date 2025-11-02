import Coffee from '../models/Coffee.js';
import { getPagination } from '../utils/pagination.js';

export async function createCoffee(req, res) {
  const doc = await Coffee.create(req.body);
  res.status(201).json(doc);
}

export async function listCoffees(req, res) {
  const { page, limit, skip } = getPagination(req.query);
  const q = {};
  if (req.query.available !== undefined) q.available = req.query.available === 'true';
  if (req.query.roast) q.roast = { $in: String(req.query.roast).split(',') };
  if (req.query.type) q.type = req.query.type;

  if (req.query.method) q.brew_methods = { $in: [req.query.method] };
  if (req.query.max_price) q.$or = [
    { 'price.value': { $lte: Number(req.query.max_price) } },
    { bag_price: { $lte: Number(req.query.max_price) } }
  ];

  if (req.query.q) {
    q.$text = { $search: req.query.q };
  }

  const [items, total] = await Promise.all([
    Coffee.find(q).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    Coffee.countDocuments(q)
  ]);
  res.json({ items, total, page, limit });
}

export async function getCoffee(req, res) {
  const doc = await Coffee.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'not found' });
  res.json(doc);
}

export async function updateCoffee(req, res) {
  const doc = await Coffee.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) return res.status(404).json({ error: 'not found' });
  res.json(doc);
}

export async function deleteCoffee(req, res) {
  const doc = await Coffee.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: 'not found' });
  res.status(204).send();
}
