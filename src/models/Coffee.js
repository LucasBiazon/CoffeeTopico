import Coffee from "../models/Coffee.js";

export async function listCoffees(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "12", 10), 1), 50);

    const query = {};
    if (req.query.type && req.query.type !== "all") {
      query.type = req.query.type;
    }
    if (req.query.roast && req.query.roast !== "all") {
      query.roast = req.query.roast;
    }
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }

    const [items, total] = await Promise.all([
      Coffee.find(query)
        .sort({ rating_avg: -1, name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Coffee.countDocuments(query),
    ]);

    res.json({
      items,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    next(err);
  }
}

export async function getCoffeeById(req, res, next) {
  try {
    const coffee = await Coffee.findById(req.params.id).lean();
    if (!coffee) return res.status(404).json({ error: "Café não encontrado" });
    res.json(coffee);
  } catch (err) {
    next(err);
  }
}
