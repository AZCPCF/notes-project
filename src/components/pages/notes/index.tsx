import { Category } from "@/app/api/categories/db";
import { fetchNotes } from "@/lib/fetch-data";
import { ApiRes } from "@/types";
import NoteCard from "./note-card";

export default async function Notes({
  categories,
}: {
  categories: ApiRes<Category>;
}) {
  try {
    const categoriesObject = Object.fromEntries(
      (await categories).data.map((item) => [item.id, item.name])
    );

    const notes = await fetchNotes();

    if (!notes?.data?.length) {
      return (
        <section className="text-xl mt-4 text-gray-400">
          No notes available
        </section>
      );
    }

    return (
      <section className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 mt-4">
        {notes.data.map((note) => {
          const category = categoriesObject[note.categoryId ?? ""];
          return <NoteCard key={note.id} note={note} category={category} />;
        })}
      </section>
    );
  } catch {
    return (
      <section className="mt-4 text-xl text-red-600">
        ❌ Error loading notes or categories
      </section>
    );
  }
}
