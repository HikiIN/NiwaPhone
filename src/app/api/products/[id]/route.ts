import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await request.json();

    if (body.status === "проданий" && !body.soldAt) {
      body.soldAt = new Date();
    }

    const updated = await Product.findByIdAndUpdate(id, body, { returnDocument: "after" });
    if (!updated) return NextResponse.json({ error: "Не знайдено" }, { status: 404 });
    
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Помилка оновлення" }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Помилка видалення" }, { status: 400 });
  }
}