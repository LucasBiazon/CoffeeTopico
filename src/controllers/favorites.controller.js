import Favorite from "../models/Favorite.js";
import Coffee from "../models/Coffee.js";

export async function listMyFavorites(req, res, next) {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.find({ user: userId })
      .populate("coffee")
      .lean();

    const items = favorites
      .map((f) => f.coffee)
      .filter(Boolean)
      .map((c) => ({
        _id: c._id,
        name: c.name,
        roastery: c.roastery,
        type: c.type,
        roast: c.roast,
        tasting_notes: c.tasting_notes,
        price: c.price,
        rating_avg: c.rating_avg,
        rating_count: c.rating_count,
        image_url: c.image_url,
      }));

    const coffeeIds = items.map((c) => c._id.toString());

    res.json({ items, coffeeIds });
  } catch (err) {
    next(err);
  }
}

export async function toggleFavorite(req, res, next) {
  try {
    const userId = req.user.id;
    const coffeeId = req.params.id;

    const existing = await Favorite.findOne({ user: userId, coffee: coffeeId });

    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return res.json({ isFavorite: false });
    }

    const coffee = await Coffee.findById(coffeeId);
    if (!coffee) {
      return res.status(404).json({ error: "Café não encontrado" });
    }

    await Favorite.create({ user: userId, coffee: coffeeId });
    res.status(201).json({ isFavorite: true });
  } catch (err) {
    next(err);
  }
}
