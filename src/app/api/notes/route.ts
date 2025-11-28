import { NextResponse } from "next/server";
import { Note, notes } from "./db";
import { delay } from "@/lib/delay";

export async function GET() {
  await delay(1000);
  return NextResponse.json({ data: notes });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      categoryId,
    }: { title?: string; content?: string; categoryId?: string } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title are required" },
        { status: 400 }
      );
    }

    const newNote: Note = {
      id: crypto.randomUUID(),
      title,
      content,
      categoryId,
      createdAt: new Date().toISOString(),
    };

    notes.push(newNote);
    return NextResponse.json({ data: { note: newNote } }, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
