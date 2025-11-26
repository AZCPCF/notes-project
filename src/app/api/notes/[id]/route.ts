import { NextResponse } from "next/server";
import { notes } from "../db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const noteIndex = notes.findIndex((note) => note.id == id);
  notes.splice(noteIndex, 1);

  return new NextResponse(null, { status: 204 });
}
