import { NextResponse } from "next/server";
import { categories } from "./db";

export async function GET() {
  return NextResponse.json({ data: categories });
}
