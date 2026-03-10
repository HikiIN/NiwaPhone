import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
    email: { type: String, required: true, unique: true },
    name: { type: String },
    role: { type: String, enum: ["Продавець", "Адміністратор"], default: "Продавець" }
}
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);