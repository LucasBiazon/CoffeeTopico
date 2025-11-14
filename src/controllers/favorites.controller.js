import Favorite from "../models/Favorite.js";
import Coffee from "../models/Coffee.js";

export async function listMyFavorites(req, res, next) {
  try {
    const userId = req.user.id;
    const favorites = await Favorite.find({ user: userId })
      .populate("coffee")
      .lean();

    const coffees = favorites
      .map((f) => f.coffee)
      .filter(Boolean);

    return res.json({
      items: coffees,
      coffeeIds: coffees.map((c) => c._id),
    });
  } catch (err) {
    next(err);
  }
}

export async function toggleFavorite(req, res, next) {
  try {
    const userId = req.user.id;
    const coffeeId = req.params.coffeeId;

    const existing = await Favorite.findOne({ user: userId, coffee: coffeeId });

    if (existing) {
      await existing.deleteOne();
      return res.json({ isFavorite: false });
    } else {
      await Favorite.create({ user: userId, coffee: coffeeId });
      return res.json({ isFavorite: true });
    }
  } catch (err) {
    next(err);
  }
}
