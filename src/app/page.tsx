import AddNote from "@/components/pages/add-note";
import Notes from "@/components/pages/notes";
import { fetchCategories } from "@/lib/fetch-data";
import { Suspense } from "react";
import { FaNoteSticky } from "react-icons/fa6";

export default async function Page() {
  const categories = fetchCategories();

  return (
    <main>
      <h1 className="text-2xl mb-4 flex items-center gap-2">
        <FaNoteSticky /> Notes App
      </h1>
      <AddNote categories={categories} />

      <Suspense
        fallback={
          <p className="mt-4 text-xl text-gray-400">Loading notes...</p>
        }
      >
        <Notes categories={categories} />
      </Suspense>
    </main>
  );
}
