import mongoose from "mongoose";
const { Schema } = mongoose;

const FavoriteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    coffee: { type: Schema.Types.ObjectId, ref: "Coffee", required: true },
  },
  { timestamps: true }
);

FavoriteSchema.index({ user: 1, coffee: 1 }, { unique: true });

export default mongoose.model("Favorite", FavoriteSchema);
