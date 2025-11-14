import mongoose from "mongoose";

const AttributesSchema = new mongoose.Schema(
  {
    acidity: { type: Number, min: 0, max: 5, default: 0 },
    sweetness: { type: Number, min: 0, max: 5, default: 0 },
    bitterness: { type: Number, min: 0, max: 5, default: 0 },
    body: { type: Number, min: 0, max: 5, default: 0 },
    aroma: { type: Number, min: 0, max: 5, default: 0 },
  },
  { _id: false }
);

const PriceSchema = new mongoose.Schema(
  {
    currency: { type: String, default: "BRL" },
    value: { type: Number, default: null },
  },
  { _id: false }
);

const CoffeeSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["drink", "bean"], required: true },
    name: { type: String, required: true, index: true },
    brand: { type: String },
    origin_country: { type: String },
    roast: { type: String, enum: ["light", "medium", "dark"], required: true },
    tasting_notes: [{ type: String }],
    attributes: { type: AttributesSchema, default: () => ({}) },
    brew_methods: [{ type: String }],
    price: { type: PriceSchema, default: () => ({ currency: "BRL" }) },
    bag_price: { type: Number },
    bag_size_g: { type: Number },
    contains: [{ type: String }],
    available: { type: Boolean, default: true },
    rating_avg: { type: Number, default: 0 },
    rating_count: { type: Number, default: 0 },
    image_url: { type: String },
    caffeine_mg: { type: Number },
    temperature: {
      type: String,
      enum: ["hot", "cold", "either"],
      default: "hot",
    },
    tags: [{ type: String }],
    seasonal: { type: Boolean, default: false },
    recommended_weather: [{ type: String }],
  },
  { timestamps: true }
);

CoffeeSchema.index({ available: 1 });
CoffeeSchema.index({ roast: 1 });
CoffeeSchema.index({ type: 1, brand: 1 });

export const Coffee = mongoose.model("Coffee", CoffeeSchema);
export default Coffee;
