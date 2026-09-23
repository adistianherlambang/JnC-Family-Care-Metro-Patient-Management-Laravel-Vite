import React, { useState, useMemo } from "react";
import styles from "./AdminDashboard.module.css";

// Official category & service mapping for detecting poli categories
const OFFICIAL_CATEGORIES = {
  Poli: [
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
  ],
  "Mom's Treatment": [
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
  ],
  Persalinan: [
    "pelayanan persalinan",
    "imd (inisiasi menyusu dini)",
    "pendampingan persalinan",
    "dcc (delayed cord clamping)"
  ],
  "Pelayanan Bayi dan Anak": [
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
};

// Harmonious brand colors for each Poli
const POLI_COLORS = {
  Poli: "var(--primary)",
  "Mom's Treatment": "#d946ef",
  Persalinan: "#8b5cf6",
  "Pelayanan Bayi dan Anak": "#0ea5e9"
};

export default function PasienPerPoliSection({
  queues = [],
  categories = [],
  isToday = () => true
}) {
  const [period, setPeriod] = useState("all"); // 'all' or 'today'

  // Helper to detect category from service name
  const detectCategory = (serviceName) => {
    if (!serviceName) return "Poli";
    const lower = serviceName.toLowerCase().trim();

    // 1. Dynamic categories matching
    for (const cat of categories) {
      if ((cat.list || []).some((s) => s.toLowerCase() === lower || lower.includes(s.toLowerCase()))) {
        return cat.title;
      }
    }

    // 2. Official category list matching
    for (const [catTitle, svcList] of Object.entries(OFFICIAL_CATEGORIES)) {
      if (svcList.some((s) => s === lower || lower.includes(s) || s.includes(lower))) {
        return catTitle;
      }
    }

    // 3. Keyword heuristics
    if (lower.includes("bayi") || lower.includes("anak") || lower.includes("imunisasi") || lower.includes("spa")) {
      return "Pelayanan Bayi dan Anak";
    }
    if (lower.includes("salin") || lower.includes("lahir") || lower.includes("persalinan")) {
      return "Persalinan";
    }
    if (lower.includes("treatment") || lower.includes("massage") || lower.includes("totok") || lower.includes("lulur")) {
      return "Mom's Treatment";
    }
    return "Poli";
  };

  // Filter queues by period (all vs today)
  const filteredQueues = useMemo(() => {
    return queues.filter((q) => {
      if (period === "today") {
        return isToday(q.date);
      }
      return true;
    });
  }, [queues, period, isToday]);

  // Aggregate patient counts per Poli / Category
  const poliStats = useMemo(() => {
    const totalPatients = filteredQueues.length;

    // Use categories if available, fallback to the 4 official titles
    const catTitles = categories.length > 0
      ? categories.map((c) => c.title)
      : Object.keys(OFFICIAL_CATEGORIES);

    const counts = {};
    catTitles.forEach((title) => {
      counts[title] = 0;
    });

    filteredQueues.forEach((q) => {
      const cat = q.category || q.category_name || detectCategory(q.service);
      if (counts[cat] !== undefined) {
        counts[cat]++;
      } else {
        counts[cat] = 1;
      }
    });

    return catTitles.map((title) => {
      const count = counts[title] || 0;
      const percent = totalPatients > 0 ? Math.round((count / totalPatients) * 100) : 0;
      const color = POLI_COLORS[title] || "var(--primary)";

      return {
        title,
        count,
        percent,
        color
      };
    });
  }, [filteredQueues, categories]);

  const totalFiltered = filteredQueues.length;

  return (
    <div className={styles.cardSection}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p className={styles.title} style={{ fontSize: "18px", margin: 0 }}>
          Sebaran Pasien per Poli Layanan
        </p>

        {/* Toggle Pill: Semua vs Hari Ini */}
        <div style={{ display: "flex", gap: "2px", backgroundColor: "#FAF0FC", padding: "2px", borderRadius: "14px" }}>
          <button
            type="button"
            style={{
              border: "none",
              background: period === "all" ? "var(--primary)" : "transparent",
              color: period === "all" ? "#fff" : "#6b7280",
              fontWeight: period === "all" ? "600" : "500",
              fontSize: "11px",
              padding: "3px 8px",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onClick={() => setPeriod("all")}
          >
            Semua
          </button>
          <button
            type="button"
            style={{
              border: "none",
              background: period === "today" ? "var(--primary)" : "transparent",
              color: period === "today" ? "#fff" : "#6b7280",
              fontWeight: period === "today" ? "600" : "500",
              fontSize: "11px",
              padding: "3px 8px",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onClick={() => setPeriod("today")}
          >
            Hari Ini
          </button>
        </div>
      </div>

      {poliStats.map((poli, idx) => (
        <div key={idx} className={styles.progressItem}>
          <div className={styles.progressLabelRow}>
            <span>{poli.title}</span>
            <span>{poli.count} Pasien</span>
          </div>
          <div className={styles.progressBarTrack}>
            <div
              className={styles.progressBarFill}
              style={{
                width: `${poli.percent}%`,
                backgroundColor: poli.color
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
