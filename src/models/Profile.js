import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    flavor: {
      acidity: { type: Number, min: 0, max: 5, default: 0 },
      sweetness: { type: Number, min: 0, max: 5, default: 0 },
      bitterness: { type: Number, min: 0, max: 5, default: 0 },
      body: { type: Number, min: 0, max: 5, default: 0 },
      aroma: { type: Number, min: 0, max: 5, default: 0 },
    },
    roast: { type: String, enum: ["light", "medium", "dark", null], default: null },
    methods: [{ type: String }],
    budget: {
      currency: { type: String, default: "BRL" },
      max: { type: Number, default: null },
    },
    milk_ok: { type: Boolean, default: true },
    sugar_ok: { type: Boolean, default: true },
    lactose_free: { type: Boolean, default: false },
    allergies: [{ type: String }],
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", ProfileSchema);
export default Profile;
