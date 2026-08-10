import { useState, useEffect, Children } from "react";

import Navbar from "../Nav/Navbar";
import Footer from "../Nav/Footer";
import styles from "./PageWrapper.module.css"

export default function PageWrapper({ children }) {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <main className={styles.content}>
        {children}
      </main>
      <Footer />
    </div>
  )
}