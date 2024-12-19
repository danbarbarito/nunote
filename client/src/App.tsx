import type { Component } from "solid-js";
import styles from "./App.module.css";
import { Route, Router } from "@solidjs/router";
import Home from "./routes/Home";

const App: Component = () => {
  return (
    <div class={styles.App}>
      <Router>
        <Route path="*" component={Home} />
      </Router>
    </div>
  );
};

export default App;
