import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";
import { User } from "@/lib/models/User";

interface ImportBody {
  products?: unknown[];
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const dbUser = await User.findOne({ email: session.user.email ?? undefined });
  if (!dbUser || dbUser.role !== "Адміністратор") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: ImportBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Невалідний JSON файл" }, { status: 400 });
  }

  const products = body?.products;
  if (!Array.isArray(products)) {
    return NextResponse.json({ error: "Файл не містить масиву products" }, { status: 400 });
  }

  let imported = 0;
  let skipped  = 0;
  const errors: string[] = [];

  for (const p of products) {
    try {
      const { _id: _1, __v: _2, createdAt: _3, updatedAt: _4, ...data } = p as Record<string, unknown>;
      void _1; void _2; void _3; void _4;
      await Product.findOneAndUpdate(
        { imei: (data as { imei: string }).imei },
        { $set: data },
        { upsert: true, new: true }
      );
      imported++;
    } catch (e) {
      skipped++;
      const msg = e instanceof Error ? e.message : String(e);
      if (errors.length < 5) errors.push(`IMEI ${(p as { imei?: string }).imei}: ${msg}`);
    }
  }

  return NextResponse.json({
    success: true,
    imported,
    skipped,
    total: products.length,
    errors: errors.length ? errors : undefined,
  });
}