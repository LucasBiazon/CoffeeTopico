import mongoose from "mongoose";
const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    coffee: {
      type: Schema.Types.ObjectId,
      ref: "Coffee",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ coffee: 1, user: 1 }, { unique: true });

export default mongoose.model("Review", ReviewSchema);
