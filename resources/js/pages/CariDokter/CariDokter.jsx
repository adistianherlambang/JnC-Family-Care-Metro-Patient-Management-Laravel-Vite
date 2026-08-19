import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CariDokter.module.css";
import PageWrapper from "../../components/PageWrapper/PageWrapper";
import Button from "../../components/Button/Button";
import { apiService } from "../../services/apiService";

export default function CariDokter() {
  const navigate = useNavigate();
  const [doctorsList, setDoctorsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      const docs = await apiService.getDoctors();
      setDoctorsList(docs);
    }
    loadData();
  }, []);

  const filteredDoctors = doctorsList.filter((doc) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = (doc.doctor || "").toLowerCase().includes(q);
    const roleMatch = (doc.role || "").toLowerCase().includes(q);
    const specMatch = (doc.specialty || "").toLowerCase().includes(q);
    return nameMatch || roleMatch || specMatch;
  });

  return (
    <PageWrapper>
      <div className={styles.container}>
        <div className={styles.banner}>
          <div className={styles.titleWrapper}>
            <p className={styles.title}>Cari Dokter & Praktisi Medis</p>
            <p className={styles.subtitle}>
              Jadwal praktek dokter spesialis kandungan, spesialis anak, dan bidan profesional yang siap melayani perawatan keluarga Anda.
            </p>
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.filterBar}>
            <input
              type="text"
              placeholder="Cari berdasarkan nama dokter, peran, atau spesialisasi..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredDoctors.length > 0 ? (
            <div className={styles.doctorGrid}>
              {filteredDoctors.map((doc, idx) => (
                <div key={doc.id || idx} className={styles.doctorCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.avatarWrapper}>
                      <img src={doc.image || "/img/landingPage/dummyDr.png"} alt={doc.doctor} />
                    </div>
                    <div className={styles.doctorInfo}>
                      <h3 className={styles.doctorName}>{doc.doctor}</h3>
                      <p className={styles.doctorRole}>{doc.role || "Praktisi Medis"}</p>
                      <p className={styles.scheduleBadge}>🗓️ {doc.schedule || "Senin - Sabtu (08.00 - 16.00 WIB)"}</p>
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <p className={styles.cardDesc}>
                      {doc.desc || `${doc.doctor} berpengalaman dalam menangani konsultasi dan perawatan kesehatan kebidanan, kandungan, dan tumbuh kembang anak.`}
                    </p>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button onClick={() => navigate("/appointment")}>
                        Buat Janji Kunjungan
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyText}>
              Dokter atau praktisi medis yang Anda cari tidak ditemukan.
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
