"use server";

import { fetcher } from "@/lib/fetcher";
import { revalidatePath } from "next/cache";

export const deleteNoteAction = async (id: string) => {
  const res = await fetcher(`/api/notes/${id}`, {
    method: "DELETE",
  });
  if (res.ok && res.status == 204) {
    console.log(res.status);
    revalidatePath("/");
  }
};
