import React from "react";
import styles from "./loading.module.css";

export default function Index() {
  return (
    <div className={styles["container"]}>
      <div className={styles["LoaderBalls"]}>
        <div className={styles["LoaderBalls__item"]}></div>
        <div className={styles["LoaderBalls__item"]}></div>
        <div className={styles["LoaderBalls__item"]}></div>
      </div>
    </div>
  );
}
