import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";

export async function GET()
{
    try
    {
        await connectDB();
        const products = await Product.find();
        return NextResponse.json(products);
    }
    catch (error)
    {
        return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
    }
}

export async function POST(request: Request)
{
    try
    {
        await connectDB();
        const body = await request.json();
        const newProduct = await Product.create(body);
        return NextResponse.json(newProduct, { status: 201 });
    }
    catch (error)
    {
        return NextResponse.json({ error: "Помилка створення" }, { status: 400 });
    }
}