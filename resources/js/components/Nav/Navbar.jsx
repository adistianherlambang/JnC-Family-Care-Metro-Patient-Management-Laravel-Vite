import { useState } from "react";
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (sectionId) => {
    setIsOpen(false);
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className={styles.container}>
      <img
        src="./logo.png"
        alt="logo"
        style={{ cursor: "pointer" }}
        onClick={() => handleNavClick("beranda")}
      />

      <div className={`${styles.hamburger} ${isOpen ? styles.hamburgerOpen : ""}`} onClick={() => setIsOpen(!isOpen)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round">
          <line x1="4" y1="6" x2="20" y2="6" className={styles.lineTop} />
          <line x1="4" y1="12" x2="20" y2="12" className={styles.lineMiddle} />
          <line x1="4" y1="18" x2="20" y2="18" className={styles.lineBottom} />
        </svg>
      </div>

      <div className={`${styles.menu} ${isOpen ? styles.open : ""}`}>
        <div className={styles.link}>
          <div className={styles.linkList} onClick={() => handleNavClick("beranda")}>Beranda</div>
          <div className={styles.linkList} onClick={() => handleNavClick("tentang-kami")}>Tentang Kami</div>
          <div className={styles.linkList} onClick={() => handleNavClick("cari-dokter")}>Cari Dokter</div>
          <div className={styles.linkList} onClick={() => handleNavClick("fasilitas")}>Fasilitas</div>
          <div className={styles.linkList} onClick={() => handleNavClick("artikel")}>Artikel</div>
        </div>
        <div className={styles.link}>
          <div className={styles.button} onClick={() => { navigate("/appointment"); setIsOpen(false); }}>Buat Appointment</div>
          <div className={styles.button} onClick={() => { navigate("/login"); setIsOpen(false); }}>
            <svg viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.75 8.75C10.9591 8.75 12.75 6.95914 12.75 4.75C12.75 2.54086 10.9591 0.75 8.75 0.75C6.54086 0.75 4.75 2.54086 4.75 4.75C4.75 6.95914 6.54086 8.75 8.75 8.75Z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M16.75 16.25C16.75 18.735 16.75 20.75 8.75 20.75C0.75 20.75 0.75 18.735 0.75 16.25C0.75 13.765 4.332 11.75 8.75 11.75C13.168 11.75 16.75 13.765 16.75 16.25Z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Login
          </div>
        </div>
      </div>
    </div>
  );
}