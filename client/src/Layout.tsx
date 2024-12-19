import { ParentComponent } from "solid-js";
import styles from "./Layout.module.css";
import { A } from "@solidjs/router";

const Layout: ParentComponent<{}> = (props) => {
  return (
    <>
      <header class={styles.header}>
        <A class={styles.headerLink} href="/">
          nunote
        </A>
      </header>
      <main>{props.children}</main>
    </>
  );
};

export default Layout;
