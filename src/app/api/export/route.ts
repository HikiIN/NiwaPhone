import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";
import { User } from "@/lib/models/User";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const dbUser = await User.findOne({ email: session.user.email });
  if (!dbUser || !["Продавець", "Адміністратор"].includes(dbUser.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const products = await Product.find({}).lean();

  let users = null;
  if (dbUser.role === "Адміністратор") {
    users = await User.find({}).select("-__v").lean();
  }

  const exportData = {
    exportedAt: new Date().toISOString(),
    exportedBy: {
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
    },
    stats: {
      totalProducts: products.length,
      inStock: products.filter((p: { status: string }) => p.status === "в наявності").length,
      sold:    products.filter((p: { status: string }) => p.status === "проданий").length,
      ...(users ? { totalUsers: users.length } : {}),
    },
    products,
    ...(users ? { users } : {}),
  };

  const json = JSON.stringify(exportData, null, 2);

  return new NextResponse(json, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="niwaphone-db-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}