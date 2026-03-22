import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name:  { type: String },
    image: { type: String },
    role:  {
      type: String,
      enum: ["Гість", "Продавець", "Адміністратор"],
      default: "Гість",
    },
  },
  { timestamps: true }
);

delete (mongoose.models as any).User;

delete (mongoose.models as any).User;
export const User = mongoose.model("User", userSchema);