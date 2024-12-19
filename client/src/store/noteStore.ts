import { createStore } from "solid-js/store";
import { Note } from "../types/Note";
import { makePersisted } from "@solid-primitives/storage";
import { NoteFilter } from "../types/NoteFilter";

const [notes, setNotes] = makePersisted(createStore<Note[]>([]));
const [tags, setTags] = makePersisted(createStore<string[]>([]));

const [noteFilter, setNoteFilter] = createStore<NoteFilter>({
  search: "",
  tags: [],
});

export const noteStore = {
  notes,
  tags,
  noteFilter,

  filteredNotes: () => {
    return notes.filter((note) => {
      return (
        note.content
          .toLowerCase()
          .includes(noteFilter.search.toLowerCase().trim()) &&
        noteFilter.tags.every((tag) => note.tags.includes(tag))
      );
    });
  },

  addNote: (note: Omit<Note, "index" | "date" | "updated_at">) => {
    const newNote: Note = {
      ...note,
      index: notes.length,
      date: new Date(),
    };
    setNotes([newNote, ...notes]);
  },

  deleteNote: (note: Note) => {
    const newNotes = notes.filter((n) => n.index !== note.index);
    setNotes(newNotes);
  },

  updateNote: (note: Note) => {
    const newNotes = notes.map((n) => {
      if (n.index === note.index) {
        return note;
      }
      return n;
    });
    setNotes(newNotes);
  },

  fetchNotes: async () => {
    const response = await fetch("/api/notes").then((res) => res.json());
    const notes = response.notes.map((note: any) => {
      return {
        index: note.index,
        content: note.content ? note.content : "",
        tags: note.tags ? note.tags : [],
        date: note.date ? new Date(note.date) : null,
      };
    });
    setNotes(notes);
    setTags(response.tags);
    return response;
  },

  saveAddNote: async (note: Omit<Note, "index" | "date" | "updated_at">) => {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    }).then((res) => res.json());
    return response;
  },

  saveDeleteNote: async (note: Note) => {
    const response = await fetch(`/api/notes/${note.index}`, {
      method: "DELETE",
    }).then((res) => res.json());
    return response;
  },

  saveUpdateNote: async (note: Note) => {
    const response = await fetch(`/api/notes/${note.index}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    }).then((res) => res.json());
    return response;
  },

  resetFilters: () => {
    setNoteFilter({
      search: "",
      tags: [],
    });
  },

  setSearchFilter: (search: string) => {
    setNoteFilter({
      ...noteFilter,
      search,
    });
  },

  setTagFilters: (tags: string[]) => {
    setNoteFilter({
      ...noteFilter,
      tags,
    });
  },
};
