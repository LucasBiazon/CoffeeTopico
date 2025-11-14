import Coffee from "../models/Coffee.js";

function buildCoffeeQuery(query) {
  const filter = {};
  if (query.type) {
    filter.type = query.type;
  }
  if (query.roast) {
    filter.roast = query.roast;
  }
  if (query.available !== undefined) {
    filter.available = query.available === "true";
  }
  if (query.search) {
    filter.name = { $regex: query.search, $options: "i" };
  }
  if (query.contains) {
    filter.contains = query.contains;
  }
  if (query.tag) {
    filter.tags = query.tag;
  }
  return filter;
}

export async function listCoffees(req, res, next) {
  try {
    const {
      page = 1,
      limit = 12,
      sort = "name",
    } = req.query;

    const filter = buildCoffeeQuery(req.query);

    let sortObj = {};
    if (sort === "price") sortObj = { "price.value": 1 };
    else if (sort === "-price") sortObj = { "price.value": -1 };
    else if (sort === "rating") sortObj = { rating_avg: -1 };
    else sortObj = { name: 1 };

    const numericPage = Math.max(parseInt(page, 10) || 1, 1);
    const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 50);

    const [items, total] = await Promise.all([
      Coffee.find(filter)
        .sort(sortObj)
        .skip((numericPage - 1) * numericLimit)
        .limit(numericLimit)
        .lean(),
      Coffee.countDocuments(filter),
    ]);

    return res.json({
      items,
      page: numericPage,
      limit: numericLimit,
      total,
      totalPages: Math.ceil(total / numericLimit),
    });
  } catch (err) {
    next(err);
  }
}

export async function getCoffeeById(req, res, next) {
  try {
    const coffee = await Coffee.findById(req.params.id).lean();
    if (!coffee) {
      return res.status(404).json({ error: "Coffee not found" });
    }
    return res.json(coffee);
  } catch (err) {
    next(err);
  }
}

export async function createCoffee(req, res, next) {
  try {
    const data = req.body;
    const coffee = await Coffee.create(data);
    return res.status(201).json(coffee);
  } catch (err) {
    next(err);
  }
}

export async function updateCoffee(req, res, next) {
  try {
    const updated = await Coffee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ error: "Coffee not found" });
    }

    return res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteCoffee(req, res, next) {
  try {
    const deleted = await Coffee.findByIdAndDelete(req.params.id).lean();
    if (!deleted) {
      return res.status(404).json({ error: "Coffee not found" });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
