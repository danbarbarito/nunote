import EasyMDE from "easymde";
import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import { keyboardService } from "../../services/KeyboardShortcuts";
import { noteStore } from "../../store/noteStore";
import styles from "./NoteEditor.module.css";
import TagsInput from "../TagsInput/TagsInput";
import { Note } from "../../types/Note";

interface NoteEditorProps {
  existingNote?: Note;
  height?: string;
  onSave?: () => void;
  hidePreserveTags?: boolean;
}

export const NoteEditor: Component<NoteEditorProps> = (props) => {
  let textareaRef!: HTMLTextAreaElement;
  let editorInstance: EasyMDE;
  const [content, setContent] = createSignal(props.existingNote?.content || "");
  const [tags, setTags] = createSignal<string[]>(
    props.existingNote?.tags || []
  );
  const [preserveTags, setPreserveTags] = createSignal(false);

  const contentIsEmpty = () => !content().trim();

  const buttonLabel = () => {
    return props.existingNote ? "Update Note" : "Add Note";
  };

  onMount(() => {
    editorInstance = new EasyMDE({
      element: textareaRef,
      spellChecker: false,
      autofocus: true,
      placeholder: "Write your note in markdown...",
      status: ["lines", "words", "cursor"],
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
        "|",
        {
          name: "guide",
          action: "https://www.markdownguide.org/basic-syntax/",
          className: "fa fa-question-circle",
          title: "Markdown Guide",
        },
      ],
      maxHeight: props.height || "200px",
      minHeight: props.height || "200px",
    });

    editorInstance.codemirror.setValue(props.existingNote?.content || "");

    editorInstance.codemirror.on("change", () => {
      setContent(editorInstance.value());
    });

    keyboardService.setEditor(editorInstance);

    keyboardService.registerShortcut("ctrl+enter", () => {
      handleSubmit(new Event("submit"));
    });
  });

  onCleanup(() => {
    if (editorInstance) {
      editorInstance.toTextArea();
      editorInstance.cleanup();
    }
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (contentIsEmpty()) {
      return; // Don't save empty notes
    }

    let nodeBody = {
      content: content(),
      tags: tags().map((tag) => tag.trim()),
    };

    if (props.existingNote) {
      const updatedNote = {
        ...props.existingNote,
        ...nodeBody,
      };
      noteStore.updateNote(updatedNote);

      noteStore.saveUpdateNote(updatedNote).then(() => {
        noteStore.fetchNotes();
      });
    } else {
      noteStore.addNote(nodeBody);

      noteStore.saveAddNote(nodeBody).then(() => {
        noteStore.fetchNotes();
      });

      // Reset editor and tags
      editorInstance.value("");

      if (!preserveTags()) {
        setTags([]);
      }
    }

    editorInstance.codemirror.focus();

    if (props.onSave) {
      props.onSave();
    }
  };

  return (
    <form id="note-editor" class={styles.editor} onSubmit={handleSubmit}>
      <div class={styles.editorContainer}>
        <textarea ref={textareaRef} />
      </div>
      <div class={styles.controlsContainer}>
        <TagsInput
          allTags={noteStore.tags}
          tags={tags()}
          onChange={(tags) => setTags(tags)}
        />
        <button
          type="submit"
          class={styles.submitButton}
          disabled={contentIsEmpty()}
        >
          {buttonLabel()}{" "}
          <span class={styles.submitButtonHint}>(Ctrl + Enter)</span>
        </button>
      </div>
      <Show when={!props.hidePreserveTags}>
        <div class={styles.preserveTagsContainer}>
          <label for="preserveTags">Preserve Tags</label>
          <input
            value={preserveTags() ? "checked" : ""}
            onChange={(e) => setPreserveTags(e.target.checked)}
            type="checkbox"
            id="preserveTags"
            name="preserveTags"
          />
        </div>
      </Show>
    </form>
  );
};
