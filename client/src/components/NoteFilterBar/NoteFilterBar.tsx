import { Component } from "solid-js";
import styles from "./NoteFilterBar.module.css";
import { noteStore } from "../../store/noteStore";
import TagsInput from "../TagsInput/TagsInput";

const NoteFilterBar: Component<{}> = (props) => {
  const onReset = () => {
    noteStore.resetFilters();
  };

  const onSearchInput = (e: Event) => {
    noteStore.setSearchFilter((e.target as HTMLInputElement).value);
  };

  return (
    <div class={styles.noteFilterBar}>
      <div class={styles.inputContainer}>
        <input
          value={noteStore.noteFilter.search}
          onInput={onSearchInput}
          class={styles.input}
          type="text"
          placeholder="Search notes..."
        />
        <TagsInput
          allTags={noteStore.tags}
          tags={noteStore.noteFilter.tags}
          onChange={(tags) => noteStore.setTagFilters(tags)}
          existingOnly
          placeholder="Filter tags..."
        />
      </div>
      <div class={styles.buttonContainer}>
        <button onClick={onReset} class={styles.resetButton}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default NoteFilterBar;
