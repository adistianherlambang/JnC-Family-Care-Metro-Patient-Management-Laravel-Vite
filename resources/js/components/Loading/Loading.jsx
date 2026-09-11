import React from "react";
import styles from "./Loading.module.css";

export default function Loading({ text = "Memuat data...", fullPage = false, size = "md" }) {
  const content = (
    <div className={`${styles.loadingContainer} ${styles[size]}`}>
      <span className={styles.loadingText}>
        {text}
        <span className={styles.dots}>
          <span className={styles.dot1}>.</span>
          <span className={styles.dot2}>.</span>
          <span className={styles.dot3}>.</span>
        </span>
      </span>
    </div>
  );

  if (fullPage) {
    return (
      <div className={styles.fullPageOverlay}>
        {content}
      </div>
    );
  }

  return content;
}
