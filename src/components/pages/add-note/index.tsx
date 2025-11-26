"use client";
import { useState } from "react";
import Modal from "../../ui/modal";
import AddNoteForm from "./add-note-form";
import { ApiRes } from "@/types";
import { Category } from "@/app/api/categories/db";
import { FaPlus } from "react-icons/fa6";

export default function AddNote({
  categories,
}: {
  categories: ApiRes<Category>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section>
      <button
        className="bg-emerald-600 flex items-center justify-center p-3 gap-2 rounded-md md:w-auto w-full"
        onClick={() => {
          setOpen(true);
        }}
      >
        <FaPlus /> Add Note
      </button>
      <Modal
        title="Add Note"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <AddNoteForm categories={categories} setOpen={setOpen} />
      </Modal>
    </section>
  );
}
