"use client";

import { addNoteAction } from "@/actions/add-note-action";
import { Category } from "@/app/api/categories/db";
import { ApiRes } from "@/types";
import { use, useActionState, useEffect } from "react";

export default function AddNoteForm({
  setOpen,
  categories,
}: {
  setOpen: (open: boolean) => void;
  categories: ApiRes<Category>;
}) {
  const [state, action, pending] = useActionState(addNoteAction, {
    title: "",
    isSuccess: false,
  });

  const categoriesArray = use(categories);
  useEffect(() => {
    if (state.isSuccess) {
      setOpen(false);
    }
  }, [state, setOpen]);
  return (
    <form
      key={state.isSuccess ? "reset" : "form"}
      action={action}
      className="flex flex-wrap *:w-full gap-3"
    >
      <input name="title" placeholder="title" defaultValue={state.title} />
      <textarea
        name="content"
        placeholder="content"
        defaultValue={state.content}
      ></textarea>
      <select name="categoryId" defaultValue={state.categoryId}>
        <option value="">Select Category</option>
        {categoriesArray.data.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
      <p className="text-rose-500">{state.error ? state.error : ""}</p>
      <button type="submit" disabled={pending}>
        {pending ? "submitting..." : "submit"}
      </button>
    </form>
  );
}
