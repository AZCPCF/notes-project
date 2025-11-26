export type Category = { id: string; name: string };

export const categories: Category[] = [
  { id: crypto.randomUUID(), name: "Technology" },
  { id: crypto.randomUUID(), name: "Health" },
  { id: crypto.randomUUID(), name: "Education" },
  { id: crypto.randomUUID(), name: "Entertainment" },
  { id: crypto.randomUUID(), name: "Sports" },
];
