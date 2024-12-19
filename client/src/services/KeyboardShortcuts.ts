import hotkeys from "hotkeys-js";
import { noteStore } from "../store/noteStore";

type KeyboardAction = () => void;

export class KeyboardShortcutService {
  private shortcuts: Map<string, KeyboardAction> = new Map();
  private editorInstance: any = null;

  constructor() {
    // Initialize global hotkeys
    hotkeys.filter = (event) => {
      // Allow shortcuts in input fields and textareas
      return true;
    };
  }

  setEditor(editor: any) {
    this.editorInstance = editor;
  }

  registerShortcut(key: string, action: KeyboardAction) {
    this.shortcuts.set(key, action);
    hotkeys(key, (event) => {
      event.preventDefault();
      action();
    });
  }

  unregisterShortcut(key: string) {
    this.shortcuts.delete(key);
    hotkeys.unbind(key);
  }

  getEditorContent(): string {
    return this.editorInstance?.value() ?? "";
  }

  clearEditor() {
    if (this.editorInstance) {
      this.editorInstance.value("");
    }
  }
}

export const keyboardService = new KeyboardShortcutService();
