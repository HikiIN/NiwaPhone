import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    model:    { type: String, required: true },
    brand:    { type: String, required: true },
    year:     { type: Number, required: true },
    price:    { type: Number, required: true },
    imei:     { type: String, required: true, unique: true },
    imageUrl: { type: String, default: "" },
    images:   { type: [String], default: [] },
    status:   { type: String, enum: ["в наявності", "проданий"], default: "в наявності" },
    soldAt:   { type: Date, default: null },
  },
  { timestamps: true }
);

delete (mongoose.models as any).Product;

export const Product = mongoose.model("Product", productSchema);