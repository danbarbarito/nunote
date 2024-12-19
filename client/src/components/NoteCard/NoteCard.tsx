import { marked } from "marked";
import { Component, createResource, Show, Suspense } from "solid-js";
import moment from "moment";
import { Note } from "../../types/Note";
import styles from "./NoteCard.module.css";

interface NoteCardProps {
  note: Note;
  onDelete: (note: Note) => void;
  onEdit: (note: Note) => void;
}

export const NoteCard: Component<NoteCardProps> = (props) => {
  const formattedDate = (date: Date) => {
    return moment(date).format("MMMM Do YYYY, h:mm a");
  };

  const [renderedContent] = createResource(() => marked(props.note.content));

  return (
    <article class={styles.card}>
      <Suspense>
        <div class={styles.content} innerHTML={renderedContent()} />
      </Suspense>
      <Show when={props.note.tags.length > 0}>
        <div class={styles.tags}>
          {props.note.tags.map((tag) => (
            <span class={styles.tag}>{tag}</span>
          ))}
        </div>
      </Show>
      <div class={styles.metadata}>
        <Show when={props.note.date}>
          <span>Created: {formattedDate(props.note.date as Date)}</span>
        </Show>
      </div>
      <div class={styles.buttonGroup}>
        <button
          class={styles.editButton}
          onClick={() => props.onEdit(props.note)}
        >
          <svg
            fill="currentColor"
            stroke-width="0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            height="1em"
            width="1em"
            style="overflow: visible; color: currentcolor;"
          >
            <path d="m410.3 231 11.3-11.3-33.9-33.9-62.1-62.1-33.9-33.9-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2l199.2-199.2 22.6-22.7zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9l-78.2 23 23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7l-14.4 14.5-22.6 22.6-11.4 11.3 33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5l-39.3-39.4c-25-25-65.5-25-90.5 0zm-47.4 168-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
          </svg>
        </button>
        <button
          class={styles.deleteButton}
          onClick={() => props.onDelete(props.note)}
        >
          <svg
            fill="currentColor"
            stroke-width="0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            height="1em"
            width="1em"
            style="overflow: visible; color: currentcolor;"
          >
            <path d="m170.5 51.6-19 28.4h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6h-93.7c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6 36.7 55H424c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8v304c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128h-8c-13.3 0-24-10.7-24-24s10.7-24 24-24h69.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128v304c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32V128H80zm80 64v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"></path>
          </svg>
        </button>
      </div>
    </article>
  );
};
