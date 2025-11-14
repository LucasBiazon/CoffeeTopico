import Review from "../models/Review.js";
import Coffee from "../models/Coffee.js";

export async function listReviewsForCoffee(req, res, next) {
  try {
    const coffeeId = req.params.id;

    const reviews = await Review.find({ coffee: coffeeId })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate({ path: "user", select: "name email" })
      .lean();

    res.json(
      reviews.map((r) => ({
        id: r._id,
        coffeeId: r.coffee,
        user: {
          id: r.user?._id,
          name: r.user?.name || "Usuário",
          email: r.user?.email,
        },
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      }))
    );
  } catch (err) {
    next(err);
  }
}

export async function createReviewForCoffee(req, res, next) {
  try {
    const coffeeId = req.params.id;
    const userId = req.user.id;
    const { rating, comment } = req.body || {};

    const r = Number(rating);
    if (!r || r < 1 || r > 5) {
      return res
        .status(400)
        .json({ error: "rating deve ser um número entre 1 e 5" });
    }

    const coffee = await Coffee.findById(coffeeId);
    if (!coffee) {
      return res.status(404).json({ error: "Café não encontrado" });
    }

    const review = await Review.findOneAndUpdate(
      { coffee: coffeeId, user: userId },
      { $set: { rating: r, comment } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const agg = await Review.aggregate([
      { $match: { coffee: coffee._id } },
      {
        $group: {
          _id: "$coffee",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (agg.length > 0) {
      const { avgRating, count } = agg[0];
      coffee.rating_avg = avgRating;
      coffee.rating_count = count;
      await coffee.save();
    }

    const populated = await review.populate("user", "name email");

    res.status(201).json({
      id: populated._id,
      coffeeId: populated.coffee,
      user: {
        id: populated.user?._id,
        name: populated.user?.name || "Usuário",
        email: populated.user?.email,
      },
      rating: populated.rating,
      comment: populated.comment,
      createdAt: populated.createdAt,
    });
  } catch (err) {
    next(err);
  }
}
