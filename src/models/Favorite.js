import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    coffee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coffee",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

FavoriteSchema.index({ user: 1, coffee: 1 }, { unique: true });

export const Favorite = mongoose.model("Favorite", FavoriteSchema);
export default Favorite;
