import InfiniteScroll from "solid-infinite-scroll";
import { Component, createSignal, Show } from "solid-js";
import { noteStore } from "../../store/noteStore";
import { Note } from "../../types/Note";
import { NoteCard } from "../NoteCard/NoteCard";
import styles from "./NoteList.module.css";

const NoteList: Component<{
  onDelete: (note: Note) => void;
  onEdit: (note: Note) => void;
}> = (props) => {
  const [scrollIndex, setScrollIndex] = createSignal(10);
  const scrollNext = () =>
    setScrollIndex(Math.min(scrollIndex() + 10, noteStore.notes.length));

  return (
    <div class={styles.notesList}>
      <Show
        when={noteStore.filteredNotes().length}
        fallback={<div class={styles.noNotesFound}>No notes found</div>}
      >
        <InfiniteScroll
          each={noteStore.filteredNotes()?.slice(0, scrollIndex())}
          hasMore={scrollIndex() < noteStore.notes.length}
          next={scrollNext}
        >
          {(note, index) => (
            <NoteCard
              note={note}
              onDelete={props.onDelete}
              onEdit={props.onEdit}
            />
          )}
        </InfiniteScroll>
      </Show>
    </div>
  );
};

export default NoteList;
