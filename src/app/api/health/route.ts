import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    if (mongoose.connection.readyState === 1) {
      return NextResponse.json({ status: "ok", db: "connected" });
    }
    return NextResponse.json({ status: "degraded", db: "connecting" }, { status: 503 });
  } catch {
    return NextResponse.json({ status: "error", db: "disconnected" }, { status: 503 });
  }
}