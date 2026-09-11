import React from "react";
import styles from "./Loading.module.css";

export default function Loading({ text = "Memuat data...", fullPage = false, size = "md" }) {
  const content = (
    <div className={`${styles.loadingContainer} ${styles[size]}`}>
      <div className={styles.spinnerWrapper}>
        <div className={styles.spinner}></div>
        <div className={styles.pulseCore}></div>
      </div>
      {text && <p className={styles.loadingText}>{text}</p>}
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
