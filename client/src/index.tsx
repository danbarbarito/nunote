/* @refresh reload */
import { render } from "solid-js/web";

import "./index.scss";
import "@thisbeyond/solid-select/style.css";
import "easymde/dist/easymde.min.css";
import App from "./App";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(() => <App />, root!);
