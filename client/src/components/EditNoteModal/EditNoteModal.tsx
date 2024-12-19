import { render, Portal } from "solid-js/web";
import { Component, createSignal, Show } from "solid-js";
import styles from "./EditNoteModal.module.css";
import { NoteEditor } from "../NoteEditor/NoteEditor";
import { noteStore } from "../../store/noteStore";
import { Note } from "../../types/Note";

export function createEditNoteModal() {
  const [open, setOpen] = createSignal(false);
  const [note, setNote] = createSignal<Note>();

  const EditNoteModal: Component<{}> = () => {
    return (
      <Portal>
        <Show when={open()}>
          <div class={styles.modal} onClick={() => setOpen(false)}>
            <div
              class={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <NoteEditor
                hidePreserveTags
                existingNote={note()}
                onSave={() => setOpen(false)}
              />
            </div>
          </div>
        </Show>
      </Portal>
    );
  };

  return {
    openModal(note: Note) {
      setNote(note);
      setOpen(true);
    },
    EditNoteModal,
  };
}
