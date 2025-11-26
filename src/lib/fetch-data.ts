import { Category } from "@/app/api/categories/db";
import { Note } from "@/app/api/notes/db";
import { ApiRes } from "@/types";
import { fetcher } from "./fetcher";

export async function fetchCategories(): ApiRes<Category> {
  const categories = await fetcher("/api/categories", {
    cache: "no-store",
  });
  return categories.json();
}

export async function fetchNotes(): ApiRes<Note> {
  const notes = await fetcher("/api/notes", {
    cache: "no-store",
  });
  return notes.json();
}
