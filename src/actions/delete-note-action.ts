"use server";

import { revalidatePath } from "next/cache";

export const deleteNoteAction = async (id: string) => {
  const res = await fetch("/api/notes/" + id, {
    method: "DELETE",
  });
  if (res.ok && res.status == 204) {
    console.log(res.status);
    revalidatePath("/");
  }
};
