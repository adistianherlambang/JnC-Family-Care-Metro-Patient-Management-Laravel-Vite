import { useState, useEffect } from "react";
import styles from "./Fasilitas.module.css";
import PageWrapper from "../../components/PageWrapper/PageWrapper";
import BuatAppointment from "../../components/Button/BuatAppointment/BuatAppointment";
import { apiService } from "../../services/apiService";

const defaultFacilities = [
  {
    icon: "🏥",
    name: "Ruang Pemeriksaan & USG 4D",
    desc: "Dilengkapi teknologi USG 4D terkini untuk pemantauan janin secara mendetail, jelas, dan akurat oleh dokter berpengalaman."
  },
  {
    icon: "🤱",
    name: "Ruang Bersalin & Nifas VVIP",
    desc: "Suasana privat, nyaman, tenang, dan higienis didampingi bidan serta dokter spesialis kebidanan selama 24 jam."
  },
  {
    icon: "🧸",
    name: "Klinik Tumbuh Kembang & Imunisasi",
    desc: "Pemeriksaan stimulasi motorik anak, fisioterapi anak, serta layanan vaksinasi & imunisasi rutin berkualitas tinggi."
  },
  {
    icon: "💊",
    name: "Apotek & Farmasi Medis",
    desc: "Layanan obat-obatan, vitamin kehamilan, suplemen anak, dan alat kesehatan lengkap dengan jaminan keaslian."
  },
  {
    icon: "🔬",
    name: "Laboratorium Medis Cepat",
    desc: "Uji sampel laboratorium medis cepat dengan hasil presisi untuk mendukung ketepatan diagnosa kesehatan pasien."
  },
  {
    icon: "📱",
    name: "Sistem Antrean Digital Online",
    desc: "Kemudahan pendaftaran antrean dan rekam medis digital via aplikasi pasien tanpa perlu antre lama di lokasi."
  }
];

export default function Fasilitas() {
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    async function loadData() {
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
            <p className={styles.title}>Fasilitas Medis Modern</p>
            <p className={styles.subtitle}>
              Fasilitas lengkap, steril, nyaman, dan ramah keluarga untuk mendukung setiap tahap perawatan ibu dan buah hati.
            </p>
          </div>
          <BuatAppointment />
        </div>

        <div className={styles.facilitySection}>
          <div className={styles.headerCenter}>
            <h2 className={styles.sectionTitle}>Fasilitas Utama Klinik</h2>
            <p className={styles.sectionDesc}>
              Sarana dan prasarana medis yang dirancang khusus untuk kenyamanan dan keamanan pasien.
            </p>
          </div>

          <div className={styles.facilityGrid}>
            {defaultFacilities.map((fac, idx) => (
              <div key={idx} className={styles.facilityCard}>
                <span className={styles.facilityIcon}>{fac.icon}</span>
                <h3 className={styles.facilityName}>{fac.name}</h3>
                <p className={styles.facilityDetail}>{fac.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.layananWrapperSection}>
          <div className={styles.headerCenter}>
            <h2 className={styles.sectionTitle}>Cakupan Layanan Kesehatan</h2>
            <p className={styles.sectionDesc}>
              Daftar kategori layanan medis komprehensif yang tersedia di klinik kami.
            </p>
          </div>

          <div className={styles.layananGrid}>
            {categoriesList.map((item, index) => (
              <div key={index} className={styles.layananCard}>
                <p className={styles.title}>{item.title}</p>
                <div>
                  {(item.list || []).map((list, lIndex) => (
                    <div className={styles.layananItem} key={lIndex}>
                      <p style={{ margin: 0 }}>• {list}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
