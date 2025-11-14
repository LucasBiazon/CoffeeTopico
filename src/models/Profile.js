// src/models/Profile.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const ProfileSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    favoriteRoast: {
      type: String,
      enum: ["light", "medium", "dark"],
      default: "medium",
    },
    prefersMilk: { type: Boolean, default: false },
    prefersSugar: { type: Boolean, default: false },
    budgetMin: { type: Number, default: 0 },
    budgetMax: { type: Number, default: 999 },
    brewMethods: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Profile", ProfileSchema);
