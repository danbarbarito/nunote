import { Component, createEffect, createResource } from "solid-js";
import { NoteEditor } from "../components/NoteEditor/NoteEditor";
import Layout from "../Layout";

import NoteFilterBar from "../components/NoteFilterBar/NoteFilterBar";
import NoteList from "../components/NoteList/NoteList";

import { createEditNoteModal } from "../components/EditNoteModal/EditNoteModal";
import { noteStore } from "../store/noteStore";
import { Note } from "../types/Note";
import styles from "./Home.module.css";

const Home: Component<{}> = (props) => {
  const [notesResource] = createResource(noteStore.fetchNotes);
  const { EditNoteModal, openModal } = createEditNoteModal();

  const onDeleteNote = async (note: Note) => {
    const confirmation = confirm("Are you sure you want to delete this note?");
    if (!confirmation) return;

    noteStore.deleteNote(note);
    noteStore.saveDeleteNote(note).then(() => {
      noteStore.fetchNotes();
    });
  };

  const onEditNote = (note: Note) => {
    openModal(note);
  };

  createEffect(() => {
    if (notesResource()) {
      console.log("notesResource: ", notesResource());
      console.log("notes: ", noteStore.notes);
    }
  });

  return (
    <Layout>
      <div class={styles.content}>
        <NoteEditor />
        <NoteFilterBar />
        <NoteList onDelete={onDeleteNote} onEdit={onEditNote} />
        <EditNoteModal />
      </div>
    </Layout>
  );
};

export default Home;
