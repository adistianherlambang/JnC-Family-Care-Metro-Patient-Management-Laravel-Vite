import React from "react";
import styles from "./Loading.module.css";

export default function Loading({ text = "Memuat data...", className = "" }) {
  return (
    <span className={`${styles.simpleText} ${className}`}>
      {text}
    </span>
  );
}
