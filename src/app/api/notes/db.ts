export type Note = {
  id: string;
  title: string;
  content?: string;
  categoryId?: string;
  createdAt: string;
};
export type NoteField = {
  title: string;
  content?: string;
  categoryId?: string;
  error?: string;
  isSuccess?: boolean;
};

export const notes: Note[] = [];
