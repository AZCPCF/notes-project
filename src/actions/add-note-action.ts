"use server";
import { NoteField } from "@/app/api/notes/db";
import { fetcher } from "@/lib/fetcher";
import { revalidatePath } from "next/cache";

export const addNoteAction = async (
  state: NoteField,
  formData: FormData
): Promise<NoteField> => {
  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();
  const categoryId = formData.get("categoryId")?.toString();
  const note: NoteField = {
    title: title || "",
    content,
    categoryId,
    error: "",
    isSuccess: false,
  };
  if (!note.title) {
    return { ...state, ...note, error: "Title is Required", isSuccess: false };
  }
  const res = await fetcher("/api/notes", {
    body: JSON.stringify(note),
    method: "POST",
  });
  if (res.status === 400) {
    const { error } = await res.json();
    return { ...note, error };
  }

  revalidatePath("/");
  return { title: "", categoryId: "", content: "", isSuccess: true };
};
