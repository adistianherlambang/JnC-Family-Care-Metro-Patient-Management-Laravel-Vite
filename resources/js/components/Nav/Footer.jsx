import styles from "./Footer.module.css"
import BuatAppointment from "../Button/BuatAppointment/BuatAppointment";
import { useNavigate } from "react-router-dom";

export default function Footer() {

  const navigate = useNavigate();

  const link = [
    { name: "Beranda", path: "/" },
    { name: "Tentang Kami", path: "/tentang-kami" },
    { name: "Cari Dokter", path: "/cari-dokter" },
    { name: "Fasilitas", path: "/fasilitas" },
    { name: "Artikel", path: "/artikel" },
  ]

  return (
    <div className={styles.footer}>
      <div className={styles.first}>
        <div className={styles.titleContainer}>
          <p className={styles.title}>Siap Mendapatkan Pelayanan Terbaik?</p>
          <p className={styles.desc}>Jadwalkan konsultasi Anda hari ini bersama dokter dan tenaga kesehatan profesional. Kami siap mendampingi setiap langkah perjalanan kesehatan ibu dan anak.</p>
        </div>
        <BuatAppointment color="secondary" />
      </div>
      <div className={styles.second}>
        <div className={styles.linkContainer}>
          <div className={styles.linkTitle}>Link</div>
          {link.map((item, index) => (
            <div key={index} className={styles.linkList} onClick={() => navigate(item.path)}>{item.name}</div>
          ))}
        </div>
        <div className={styles.linkContainer}>
          <div className={styles.linkTitle}>Alamat</div>
          <div>
            <p>Jl. Hanafiah No.50, Imopuro, Kec. Metro Pusat, Kota Metro, Lampung</p>
            <p>0813 6875 9213</p>
          </div>
        </div>
      </div>
    </ div>
  )
}