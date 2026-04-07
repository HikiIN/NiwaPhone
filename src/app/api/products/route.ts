import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";

type MongoQuery = Record<string, unknown>;

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const brand  = searchParams.get("brand")  || "";

    const query: MongoQuery = {};
    if (status) query.status = status;
    if (brand)  query.brand  = brand;
    if (search) {
      query.$or = [
        { model: { $regex: search, $options: "i" } },
        { imei:  { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(products ?? []);
  } catch {
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const images: string[] = (body.images || []).filter(
      (url: string) => typeof url === "string" && url.trim() !== ""
    );

    const imageUrl = images[0] ?? "";

    const product = await Product.create({
      ...body,
      images,
      imageUrl,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json({ error: "IMEI вже існує" }, { status: 409 });
    }
    return NextResponse.json({ error: "Помилка створення" }, { status: 400 });
  }
}