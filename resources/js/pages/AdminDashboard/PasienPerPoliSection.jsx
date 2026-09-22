import React, { useState, useMemo } from "react";
import styles from "./AdminDashboard.module.css";
import Table, { TableBadge } from "../../components/Table/Table";
import InputText from "../../components/Input/InputText";
import Button from "../../components/Button/Button";

const OFFICIAL_POLIS = [
  {
    id: "Poli",
    title: "Poli Kebidanan & Kandungan",
    categoryKey: "Poli",
    desc: "Pemeriksaan Hamil, USG, KB & Nifas",
    doctor: "dr. Aulia Rahma, Sp.OG",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 14C20.6569 14 22 12.6569 22 11V5C22 3.34315 20.6569 2 19 2H5C3.34315 2 2 3.34315 2 5V11C2 12.6569 3.34315 14 5 14H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 6V10M10 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 14V17C7 19.7614 9.23858 22 12 22C14.7614 22 17 19.7614 17 17V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    services: [
      "prenatal class yoga",
      "aquatic yoga",
      "kelas melahirkan",
      "kb",
      "pemeriksaan dan konsultasi catin",
      "pemeriksaan nifas",
      "pemeriksaan kehamilan",
      "iva",
      "papsmear",
      "washing v"
    ]
  },
  {
    id: "Mom's Treatment",
    title: "Mom's Treatment & Spa",
    categoryKey: "Mom's Treatment",
    desc: "Treatment Laktasi, Babaran & Relaksasi",
    doctor: "Bidan Siti Rahmawati, S.Tr.Keb",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    services: [
      "special pregnant treatment",
      "treatment laktasi",
      "treatment babaran",
      "totok wajah",
      "body massage",
      "ratus v",
      "steambath",
      "lulur",
      "scrub",
      "creambath",
      "footbath"
    ]
  },
  {
    id: "Persalinan",
    title: "Ruang Bersalin (VK)",
    categoryKey: "Persalinan",
    desc: "Persalinan 24 Jam, IMD & Pendampingan",
    doctor: "Tim Dokter Sp.OG & Bidan",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 7V19M21 7V19M3 13H21M7 7H17C18.1046 7 19 7.89543 19 9V13H5V9C5 7.89543 5.89543 7 7 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="4" r="2" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    services: [
      "pelayanan persalinan",
      "imd (inisiasi menyusu dini)",
      "pendampingan persalinan",
      "dcc (delayed cord clamping)"
    ]
  },
  {
    id: "Pelayanan Bayi dan Anak",
    title: "Poli Bayi & Tumbuh Kembang",
    categoryKey: "Pelayanan Bayi dan Anak",
    desc: "Imunisasi, MTBS, Baby Spa & Skrining",
    doctor: "dr. Fitri Handayani, Sp.A",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 21V19C6 15.6863 8.68629 13 12 13C15.3137 13 18 15.6863 18 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 17L12 14L15 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    services: [
      "baby infant dan kids massage",
      "massage common cold",
      "massage diare",
      "massage konstipasi",
      "massage kolik",
      "massage kembung",
      "shk (skrining hipotiroid kongenital)",
      "konsultasi tumbuh kembang",
      "mtbs/mtbm",
      "cukur bayi",
      "jemur bayi",
      "imunisasi",
      "baby spa",
      "baby spa with parents",
      "potong kuku",
      "manicure",
      "pedicure",
      "mandi bayi",
      "cek golongan darah",
      "hygiene lidah, telinga, dan hidung",
      "tindik manual",
      "tindik dr evoo"
    ]
  }
];

export default function PasienPerPoliSection({
  queues = [],
  categories = [],
  doctors = [],
  isToday = () => true,
  onUpdateQueueStatus,
  onDeleteQueue
}) {
  const [periodFilter, setPeriodFilter] = useState("all"); // 'today' or 'all'
  const [selectedPoli, setSelectedPoli] = useState("Semua"); // 'Semua', 'Poli', "Mom's Treatment", 'Persalinan', 'Pelayanan Bayi dan Anak'
  const [searchQuery, setSearchQuery] = useState("");

  // Category resolver helper
  const detectPoliCategory = (serviceName) => {
    if (!serviceName) return "Poli";
    const lower = serviceName.toLowerCase().trim();

    for (const poli of OFFICIAL_POLIS) {
      if (poli.services.some((s) => lower.includes(s) || s.includes(lower))) {
        return poli.categoryKey;
      }
    }

    if (lower.includes("bayi") || lower.includes("anak") || lower.includes("imunisasi") || lower.includes("spa")) {
      return "Pelayanan Bayi dan Anak";
    }
    if (lower.includes("salin") || lower.includes("lahir")) {
      return "Persalinan";
    }
    if (lower.includes("treatment") || lower.includes("massage") || lower.includes("totok") || lower.includes("lulur")) {
      return "Mom's Treatment";
    }
    return "Poli";
  };

  // Base list filtered by period (Today vs All)
  const periodQueues = useMemo(() => {
    return queues.filter((q) => {
      if (periodFilter === "today") {
        return isToday(q.date);
      }
      return true;
    }).map((q) => ({
      ...q,
      poliCategory: q.category || q.category_name || detectPoliCategory(q.service)
    }));
  }, [queues, periodFilter, isToday]);

  // Aggregated data per Poli
  const poliStats = useMemo(() => {
    const totalAll = periodQueues.length;

    return OFFICIAL_POLIS.map((poli) => {
      const poliQueues = periodQueues.filter((q) => q.poliCategory === poli.categoryKey);
      const count = poliQueues.length;
      const selesai = poliQueues.filter((q) => q.status === "Selesai").length;
      const dilayani = poliQueues.filter((q) => q.status === "Dipanggil" || q.status === "Sedang Dilayani").length;
      const menunggu = poliQueues.filter((q) => q.status === "Menunggu Antrean").length;
      const percent = totalAll > 0 ? Math.round((count / totalAll) * 100) : 0;

      // Find dynamic doctor if available
      const matchedDoctor = doctors.find((d) => {
        const docSvcs = d.services || d.schedules?.[0]?.services || [];
        return docSvcs.some((s) => poli.services.includes(String(s).toLowerCase()));
      });

      return {
        ...poli,
        count,
        selesai,
        dilayani,
        menunggu,
        percent,
        assignedDoctor: matchedDoctor?.doctor || poli.doctor
      };
    });
  }, [periodQueues, doctors]);

  // Patients filtered by selected Poli and search
  const displayedPatients = useMemo(() => {
    return periodQueues.filter((q) => {
      if (selectedPoli !== "Semua" && q.poliCategory !== selectedPoli) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const patient = (q.patientName || q.patient_name || "").toLowerCase();
        const num = (q.queueNumber || q.queue_number || "").toLowerCase();
        const doc = (q.doctor || "").toLowerCase();
        const svc = (q.service || "").toLowerCase();
        const date = (q.date || "").toLowerCase();
        return (
          patient.includes(query) ||
          num.includes(query) ||
          doc.includes(query) ||
          svc.includes(query) ||
          date.includes(query)
        );
      }
      return true;
    });
  }, [periodQueues, selectedPoli, searchQuery]);

  const totalPatientsCount = periodQueues.length;

  return (
    <div className={styles.poliSectionWrapper}>
      {/* 1. Header & Period Filter Toggle */}
      <div className={styles.poliSectionHeader}>
        <div>
          <h3 className={styles.title} style={{ fontSize: "20px", margin: 0 }}>
            Sebaran Pasien per Poli Layanan
          </h3>
          <p className={styles.desc} style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0 0" }}>
            Monitoring volume pasien terdaftar, tingkat penyelesaian, dan dokter bertugas di setiap poli klinik.
          </p>
        </div>

        <div className={styles.toggleGroup}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${periodFilter === "all" ? styles.toggleBtnActive : ""}`}
            onClick={() => setPeriodFilter("all")}
          >
            Semua Riwayat ({queues.length})
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${periodFilter === "today" ? styles.toggleBtnActive : ""}`}
            onClick={() => setPeriodFilter("today")}
          >
            Hari Ini ({queues.filter((q) => isToday(q.date)).length})
          </button>
        </div>
      </div>

      {/* 2. 4 Interactive Poli Cards */}
      <div className={styles.poliGrid}>
        {poliStats.map((poli) => {
          const isSelected = selectedPoli === poli.categoryKey;
          return (
            <div
              key={poli.id}
              className={`${styles.poliCard} ${isSelected ? styles.poliCardActive : ""}`}
              onClick={() => setSelectedPoli(isSelected ? "Semua" : poli.categoryKey)}
              title={`Klik untuk memfilter antrean ${poli.title}`}
            >
              <div className={styles.poliHeader}>
                <div className={styles.poliIconWrapper}>
                  {poli.icon}
                </div>
                <div className={styles.poliTitleGroup}>
                  <span className={styles.poliName}>{poli.title}</span>
                  <span className={styles.poliCategoryDesc}>{poli.desc}</span>
                </div>
              </div>

              <div className={styles.poliCountRow}>
                <span className={styles.poliCountNumber}>{poli.count} Pasien</span>
                <span className={styles.poliCountPercent}>{poli.percent}% Total</span>
              </div>

              {/* Progress Breakdown Bar */}
              <div className={styles.progressItem} style={{ gap: "4px" }}>
                <div className={styles.progressBarTrack} style={{ height: "6px" }}>
                  <div
                    style={{
                      height: "100%",
                      width: poli.count > 0 ? `${(poli.selesai / poli.count) * 100}%` : "0%",
                      backgroundColor: "#16a34a",
                      display: "inline-block"
                    }}
                    title={`Selesai: ${poli.selesai}`}
                  />
                  <div
                    style={{
                      height: "100%",
                      width: poli.count > 0 ? `${(poli.dilayani / poli.count) * 100}%` : "0%",
                      backgroundColor: "var(--primary)",
                      display: "inline-block"
                    }}
                    title={`Sedang Dilayani: ${poli.dilayani}`}
                  />
                  <div
                    style={{
                      height: "100%",
                      width: poli.count > 0 ? `${(poli.menunggu / poli.count) * 100}%` : "0%",
                      backgroundColor: "#c2410c",
                      display: "inline-block"
                    }}
                    title={`Menunggu: ${poli.menunggu}`}
                  />
                </div>
              </div>

              {/* Status Chips Row */}
              <div className={styles.poliStatusRow}>
                <span>
                  <span className={styles.poliStatusDot} style={{ backgroundColor: "#16a34a" }} />
                  {poli.selesai} Selesai
                </span>
                <span>•</span>
                <span>
                  <span className={styles.poliStatusDot} style={{ backgroundColor: "var(--primary)" }} />
                  {poli.dilayani} Proses
                </span>
                <span>•</span>
                <span>
                  <span className={styles.poliStatusDot} style={{ backgroundColor: "#c2410c" }} />
                  {poli.menunggu} Antre
                </span>
              </div>

              {/* Doctor In-charge */}
              <div className={styles.poliDoctorRow}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "var(--primary)", flexShrink: 0 }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor"/>
                </svg>
                <span className={styles.poliDoctorName}>{poli.assignedDoctor}</span>
                {isSelected && (
                  <span className={styles.poliActiveIndicator}>
                    ✓ Terpilih
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Detailed Table of Patients in Selected Poli */}
      <div className={styles.inputContainer}>
        <Table
          title={
            selectedPoli === "Semua"
              ? `Rincian Pasien Seluruh Poli (${displayedPatients.length} Pasien)`
              : `Daftar Pasien - ${selectedPoli} (${displayedPatients.length} Pasien)`
          }
          headerAction={
            <div className={styles.tableHeaderActionGroup}>
              <div className={styles.tableFilterGroup}>
                <div style={{ minWidth: "220px", flex: 1 }}>
                  <InputText
                    placeholder="Cari pasien, no. antrean, dokter, layanan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {selectedPoli !== "Semua" && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedPoli("Semua")}
                  >
                    Tampilkan Semua Poli
                  </Button>
                )}
              </div>
            </div>
          }
          emptyMessage={`Belum ada pasien terdaftar pada ${selectedPoli === "Semua" ? "semua poli" : selectedPoli} untuk filter yang dipilih.`}
        >
          <thead>
            <tr>
              <th style={{ width: "40px" }}>No</th>
              <th>No. Antrean</th>
              <th>Nama Pasien</th>
              <th>Poli / Kategori</th>
              <th>Layanan Medis</th>
              <th>Dokter / Bidan</th>
              <th>Tanggal & Jam</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {displayedPatients.length > 0 ? (
              displayedPatients.map((q, idx) => (
                <tr key={q.id || idx}>
                  <td>{idx + 1}</td>
                  <td style={{ fontWeight: "600", color: "var(--primary)" }}>{q.queueNumber}</td>
                  <td style={{ fontWeight: "500" }}>{q.patientName}</td>
                  <td>
                    <span className={styles.categoryBadge}>{q.poliCategory}</span>
                  </td>
                  <td>{q.service}</td>
                  <td>{q.doctor}</td>
                  <td>
                    {q.date} • {q.time}
                  </td>
                  <td>
                    <TableBadge status={q.status} />
                  </td>
                  <td>
                    <Table.ActionCell>
                      {onUpdateQueueStatus && q.status !== "Selesai" && (
                        <Button
                          size="sm"
                          onClick={() => onUpdateQueueStatus(q.id, q.status === "Menunggu Antrean" ? "Dipanggil" : "Selesai")}
                        >
                          {q.status === "Menunggu Antrean" ? "Panggil" : "Selesai"}
                        </Button>
                      )}
                      {onDeleteQueue && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => onDeleteQueue(q.id)}
                        >
                          Hapus
                        </Button>
                      )}
                    </Table.ActionCell>
                  </td>
                </tr>
              ))
            ) : null}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
