"use client";
import { deleteNoteAction } from "@/actions/delete-note-action";
import { Note } from "@/app/api/notes/db";
import { useState } from "react";
import { FaTrash } from "react-icons/fa6";

export default function NoteCard({ note, category }: { note: Note; category?: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-stone-800 p-3 rounded-md flex flex-col gap-1.5 min-h-[158px] relative">
      <p className="font-extrabold text-xl">{note.title}</p>
      {category && <p>category: {category}</p>}
      <p className="truncate">{note.content}</p>

      <div className="w-[96%] left-1/2 -translate-x-1/2 flex justify-end absolute bottom-2.5">
        <button
          onClick={async () => {
            setLoading(true);
            await deleteNoteAction(note.id);
            setLoading(false);
          }}
          data-loading={loading}
          className="bg-rose-500 data-[loading=true]:bg-rose-400 rounded-md px-3 py-2 flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <FaTrash />
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
