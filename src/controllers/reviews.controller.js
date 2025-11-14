import mongoose from "mongoose";
import Review from "../models/review.model.js";
import Coffee from "../models/coffee.model.js";

export async function listReviews(req, res, next) {
  try {
    const { coffeeId } = req.params;

    const reviews = await Review.find({ coffee_id: coffeeId })
      .sort({ createdAt: -1 })
      .populate("user_id", "name email")
      .lean();

    const mapped = reviews.map((r) => ({
      _id: r._id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      user: r.user_id ? {
        _id: r.user_id._id,
        name: r.user_id.name,
        email: r.user_id.email,
      } : undefined,
    }));

    res.json(mapped);
  } catch (err) {
    next(err);
  }
}

export async function createReview(req, res, next) {
  try {
    const { coffeeId } = req.params;
    const userId = req.user.id;

    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: "rating deve ser um número entre 1 e 5",
      });
    }

    const review = await Review.create({
      coffee_id: new mongoose.Types.ObjectId(coffeeId),
      user_id: new mongoose.Types.ObjectId(userId),
      rating,
      comment: comment?.trim(),
    });

    const [agg] = await Review.aggregate([
      { $match: { coffee_id: new mongoose.Types.ObjectId(coffeeId) } },
      {
        $group: {
          _id: "$coffee_id",
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (agg) {
      await Coffee.findByIdAndUpdate(coffeeId, {
        rating_avg: agg.avg,
        rating_count: agg.count,
      });
    }

    const populated = await review.populate("user_id", "name email");

    return res.status(201).json({
      _id: populated._id,
      rating: populated.rating,
      comment: populated.comment,
      createdAt: populated.createdAt,
      user: populated.user_id
        ? {
          _id: populated.user_id._id,
          name: populated.user_id.name,
          email: populated.user_id.email,
        }
        : undefined,
    });
  } catch (err) {
    if (
      err?.code === 11000 &&
      err?.keyPattern?.user_id &&
      err?.keyPattern?.coffee_id
    ) {
      return res.status(409).json({
        error: "Você já enviou um review para este café.",
      });
    }
    next(err);
  }
}
