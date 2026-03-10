import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
{
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    imei: { type: String, required: true, unique: true },
    status: { type: String, enum: ["в наявності", "проданий"], default: "в наявності" }
}
);

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);