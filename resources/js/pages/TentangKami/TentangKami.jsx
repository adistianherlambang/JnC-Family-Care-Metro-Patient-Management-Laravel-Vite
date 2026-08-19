import { useState, useEffect } from "react";
import styles from "./TentangKami.module.css";
import PageWrapper from "../../components/PageWrapper/PageWrapper";
import BuatAppointment from "../../components/Button/BuatAppointment/BuatAppointment";
import { apiService } from "../../services/apiService";

export default function TentangKami() {
  const [doctorsList, setDoctorsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    async function loadData() {
      const docs = await apiService.getDoctors();
      setDoctorsList(docs);
      const cats = await apiService.getCategories();
      setCategoriesList(cats);
    }
    loadData();
  }, []);

  return (
    <PageWrapper>
      <div className={styles.container}>
        <div className={styles.banner}>
          <div className={styles.titleWrapper}>
            <p className={styles.title}>Tentang Klinik JnC Family Care Metro</p>
            <p className={styles.subtitle}>
              Pelayanan kesehatan ibu, bayi, dan tumbuh kembang anak terpercaya dengan komitmen kenyamanan dan standar medis tertinggi untuk keluarga Anda.
            </p>
          </div>
          <BuatAppointment />
        </div>

        <div className={`${styles.sectionWrapper} ${styles.sectionBg}`}>
          <div className={styles.headerCenter}>
            <h2 className={styles.sectionTitle}>Visi & Misi Kami</h2>
            <p className={styles.sectionDesc}>
              Fondasi dan komitmen kami dalam menghadirkan pelayanan kesehatan ibu dan anak yang hangat, modern, dan profesional.
            </p>
          </div>

          <div className={styles.visiMisiGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Visi Kami</h3>
              <p className={styles.cardText}>
                Menjadi pusat pelayanan kesehatan ibu dan anak terdepan di Metro yang menghadirkan perawatan medis berkualitas tinggi, ramah keluarga, dan berbasis standar medis terkini.
              </p>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Misi Kami</h3>
              <div className={styles.misiList}>
                <div className={styles.misiItem}>
                  <span className={styles.misiNumber}>1</span>
                  <p className={styles.cardText}>
                    Memberikan pelayanan kebidanan, kandungan, dan spesialis anak secara komprehensif dan profesional.
                  </p>
                </div>
                <div className={styles.misiItem}>
                  <span className={styles.misiNumber}>2</span>
                  <p className={styles.cardText}>
                    Mengutamakan keselamatan, kenyamanan, dan edukasi kesehatan keluarga di setiap tahap perawatan.
                  </p>
                </div>
                <div className={styles.misiItem}>
                  <span className={styles.misiNumber}>3</span>
                  <p className={styles.cardText}>
                    Menghadirkan fasilitas medis modern dan ramah anak demi mendukung tumbuh kembang generasi sehat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.counterWrapper}>
          <div className={styles.counter}>
            <p className={styles.counterNumber}>{doctorsList.length}</p>
            <p className={styles.counterLabel}>Profesional Medis</p>
          </div>
          <div className={styles.counter}>
            <p className={styles.counterNumber}>10K+</p>
            <p className={styles.counterLabel}>Pasien Dilayani</p>
          </div>
          <div className={styles.counter}>
            <p className={styles.counterNumber}>{categoriesList.length}</p>
            <p className={styles.counterLabel}>Kategori Layanan</p>
          </div>
        </div>

        <div className={styles.teamWrapper}>
          <div className={styles.headerCenter}>
            <h2 className={styles.sectionTitle}>Tim Dokter & Bidan Kami</h2>
            <p className={styles.sectionDesc}>
              Tenaga kesehatan berpengalaman yang siap mendampingi setiap perjalanan kesehatan keluarga Anda.
            </p>
          </div>
          <div className={styles.teamList}>
            {doctorsList.map((item, index) => (
              <div key={index} className={styles.team}>
                <div className={styles.teamImgWrapper}>
                  <img src={item.image || "/img/landingPage/dummyDr.png"} alt={item.doctor} />
                </div>
                <div className={styles.teamName}>
                  <p className={styles.teamTitle}>{item.doctor}</p>
                  <p className={styles.teamDesc}>{item.role || "Praktisi Medis"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
