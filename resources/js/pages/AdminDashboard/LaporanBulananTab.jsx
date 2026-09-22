import React, { useState, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import styles from "./AdminDashboard.module.css";
import Title from "../../components/Title/Title";
import Table, { TableBadge } from "../../components/Table/Table";
import Button from "../../components/Button/Button";
import InputText from "../../components/Input/InputText";
import InputSelect from "../../components/Input/InputSelect";
import Modal from "../../components/Modal/Modal";

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember"
];

const MONTH_OPTIONS = MONTH_NAMES.map((name, idx) => ({
  value: String(idx + 1),
  label: name
}));

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [
  { value: String(CURRENT_YEAR - 1), label: String(CURRENT_YEAR - 1) },
  { value: String(CURRENT_YEAR), label: String(CURRENT_YEAR) },
  { value: String(CURRENT_YEAR + 1), label: String(CURRENT_YEAR + 1) }
];

const STATUS_OPTIONS = [
  { value: "Semua", label: "Semua Status" },
  { value: "Selesai", label: "Selesai" },
  { value: "Sedang Dilayani", label: "Sedang Dilayani / Dipanggil" },
  { value: "Menunggu Antrean", label: "Menunggu Antrean" },
  { value: "Dibatalkan", label: "Dibatalkan" }
];

// Fallback categorization for official JnC clinic services
const OFFICIAL_CATEGORIES = {
  Poli: [
    "Prenatal Class Yoga",
    "Aquatic Yoga",
    "Kelas Melahirkan",
    "KB",
    "Pemeriksaan dan Konsultasi Catin (Persiapan Hamil, Melahirkan, Menyusui)",
    "Pemeriksaan Nifas",
    "Pemeriksaan Kehamilan",
    "IVA",
    "Papsmear",
    "Washing V"
  ],
  "Mom's Treatment": [
    "Special Pregnant Treatment",
    "Treatment Laktasi",
    "Treatment Babaran",
    "Totok Wajah",
    "Body Massage",
    "Ratus V",
    "Steambath",
    "Lulur",
    "Scrub",
    "Creambath",
    "Footbath"
  ],
  Persalinan: [
    "Pelayanan Persalinan",
    "IMD (Inisiasi Menyusu Dini)",
    "Pendampingan Persalinan",
    "DCC (Delayed Cord Clamping)"
  ],
  "Pelayanan Bayi dan Anak": [
    "Baby Infant dan Kids Massage",
    "Massage Common Cold",
    "Massage Diare",
    "Massage Konstipasi",
    "Massage Kolik",
    "Massage Kembung",
    "SHK (Skrining Hipotiroid Kongenital)",
    "Konsultasi Tumbuh Kembang",
    "MTBS/MTBM",
    "Cukur Bayi",
    "Jemur Bayi",
    "Imunisasi",
    "Baby Spa",
    "Baby Spa with Parents",
    "Potong Kuku",
    "Manicure",
    "Pedicure",
    "Mandi Bayi",
    "Cek Golongan Darah",
    "Hygiene Lidah, Telinga, dan Hidung",
    "Tindik Manual",
    "Tindik dr Evoo"
  ]
};

export default function LaporanBulananTab({
  queues = [],
  doctors = [],
  categories = [],
  isLoading = false
}) {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(currentDate.getMonth() + 1));
  const [selectedYear, setSelectedYear] = useState(String(currentDate.getFullYear()));
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedDoctor, setSelectedDoctor] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Helper to detect category for a given service
  const detectCategory = (serviceName) => {
    if (!serviceName) return "Layanan Medis";

    // 1. Check dynamic categories prop
    for (const cat of categories) {
      const svcs = cat.list || cat.services || [];
      if (svcs.some((s) => s.toLowerCase() === serviceName.toLowerCase())) {
        return cat.title;
      }
    }

    // 2. Check official mapping
    for (const [catTitle, svcList] of Object.entries(OFFICIAL_CATEGORIES)) {
      if (svcList.some((s) => s.toLowerCase() === serviceName.toLowerCase())) {
        return catTitle;
      }
    }

    // Heuristics
    const lower = serviceName.toLowerCase();
    if (lower.includes("bayi") || lower.includes("anak") || lower.includes("imunisasi") || lower.includes("spa")) {
      return "Pelayanan Bayi dan Anak";
    }
    if (lower.includes("salin") || lower.includes("lahiran") || lower.includes("persalinan")) {
      return "Persalinan";
    }
    if (lower.includes("treatment") || lower.includes("massage") || lower.includes("lulur") || lower.includes("totok")) {
      return "Mom's Treatment";
    }
    return "Poli";
  };

  // Helper to parse date string into { year, month, day }
  const parseQueueDate = (dateStr) => {
    if (!dateStr) return null;
    const lower = String(dateStr).toLowerCase().trim();

    if (lower === "hari ini" || lower === "today") {
      const now = new Date();
      return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    }
    if (lower === "besok" || lower === "tomorrow") {
      const tmrw = new Date();
      tmrw.setDate(tmrw.getDate() + 1);
      return { year: tmrw.getFullYear(), month: tmrw.getMonth() + 1, day: tmrw.getDate() };
    }

    // YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [y, m, d] = dateStr.split("-").map(Number);
      return { year: y, month: m, day: d };
    }

    // DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [d, m, y] = dateStr.split("/").map(Number);
      return { year: y, month: m, day: d };
    }

    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return { year: parsed.getFullYear(), month: parsed.getMonth() + 1, day: parsed.getDate() };
    }

    return null;
  };

  // Category dropdown options
  const categoryOptions = useMemo(() => {
    const list = [{ value: "Semua", label: "Semua Kategori" }];
    const uniqueTitles = new Set();

    categories.forEach((c) => {
      if (c.title && !uniqueTitles.has(c.title)) {
        uniqueTitles.add(c.title);
        list.push({ value: c.title, label: c.title });
      }
    });

    Object.keys(OFFICIAL_CATEGORIES).forEach((title) => {
      if (!uniqueTitles.has(title)) {
        uniqueTitles.add(title);
        list.push({ value: title, label: title });
      }
    });

    return list;
  }, [categories]);

  // Doctor dropdown options
  const doctorOptions = useMemo(() => {
    const list = [{ value: "Semua", label: "Semua Praktisi Medis" }];
    const seen = new Set();
    doctors.forEach((d) => {
      const docName = d.doctor || d.name;
      if (docName && !seen.has(docName)) {
        seen.add(docName);
        list.push({ value: docName, label: docName });
      }
    });
    return list;
  }, [doctors]);

  // Enhanced queues with resolved categories
  const enrichedQueues = useMemo(() => {
    return queues.map((q) => {
      const dateObj = parseQueueDate(q.date);
      const category = q.category || q.category_name || detectCategory(q.service);
      return {
        ...q,
        dateObj,
        category
      };
    });
  }, [queues, categories]);

  // Filter queues matching selected Month and Year
  const monthlyQueues = useMemo(() => {
    const targetMonth = Number(selectedMonth);
    const targetYear = Number(selectedYear);

    return enrichedQueues.filter((q) => {
      if (!q.dateObj) return false;
      return q.dateObj.year === targetYear && q.dateObj.month === targetMonth;
    });
  }, [enrichedQueues, selectedMonth, selectedYear]);

  // Apply secondary filters (category, doctor, status, search)
  const filteredQueues = useMemo(() => {
    return monthlyQueues.filter((q) => {
      // Category filter
      if (selectedCategory !== "Semua" && q.category !== selectedCategory) {
        return false;
      }
      // Doctor filter
      if (selectedDoctor !== "Semua" && q.doctor !== selectedDoctor) {
        return false;
      }
      // Status filter
      if (selectedStatus !== "Semua") {
        if (selectedStatus === "Sedang Dilayani") {
          if (q.status !== "Sedang Dilayani" && q.status !== "Dipanggil") return false;
        } else if (q.status !== selectedStatus) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const patient = (q.patientName || q.patient_name || "").toLowerCase();
        const num = (q.queueNumber || q.queue_number || "").toLowerCase();
        const doc = (q.doctor || "").toLowerCase();
        const svc = (q.service || "").toLowerCase();
        const cat = (q.category || "").toLowerCase();
        const date = (q.date || "").toLowerCase();
        return (
          patient.includes(query) ||
          num.includes(query) ||
          doc.includes(query) ||
          svc.includes(query) ||
          cat.includes(query) ||
          date.includes(query)
        );
      }
      return true;
    });
  }, [monthlyQueues, selectedCategory, selectedDoctor, selectedStatus, searchQuery]);

  // Executive Statistics Calculations
  const stats = useMemo(() => {
    const total = filteredQueues.length;
    const selesai = filteredQueues.filter((q) => q.status === "Selesai").length;
    const dipanggil = filteredQueues.filter(
      (q) => q.status === "Dipanggil" || q.status === "Sedang Dilayani"
    ).length;
    const menunggu = filteredQueues.filter((q) => q.status === "Menunggu Antrean").length;
    const batal = filteredQueues.filter((q) => q.status === "Dibatalkan").length;

    const selesaiPercent = total > 0 ? Math.round((selesai / total) * 100) : 0;

    // Top Service
    const serviceCounts = {};
    filteredQueues.forEach((q) => {
      if (q.service) {
        serviceCounts[q.service] = (serviceCounts[q.service] || 0) + 1;
      }
    });
    let topService = { name: "Belum Ada", count: 0 };
    Object.entries(serviceCounts).forEach(([name, count]) => {
      if (count > topService.count) {
        topService = { name, count };
      }
    });

    // Top Doctor
    const doctorCounts = {};
    filteredQueues.forEach((q) => {
      if (q.doctor) {
        doctorCounts[q.doctor] = (doctorCounts[q.doctor] || 0) + 1;
      }
    });
    let topDoctor = { name: "Belum Ada", count: 0 };
    Object.entries(doctorCounts).forEach(([name, count]) => {
      if (count > topDoctor.count) {
        topDoctor = { name, count };
      }
    });

    // Category Distribution
    const categoryCounts = {
      Poli: 0,
      "Mom's Treatment": 0,
      Persalinan: 0,
      "Pelayanan Bayi dan Anak": 0
    };
    filteredQueues.forEach((q) => {
      if (categoryCounts[q.category] !== undefined) {
        categoryCounts[q.category]++;
      } else {
        categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
      }
    });

    return {
      total,
      selesai,
      dipanggil,
      menunggu,
      batal,
      selesaiPercent,
      topService,
      topDoctor,
      categoryCounts
    };
  }, [filteredQueues]);

  const selectedMonthName = MONTH_NAMES[Number(selectedMonth) - 1] || "Bulan";

  // Format today's date in Indonesian
  const getIndonesianFullDate = () => {
    const d = new Date();
    const day = d.getDate();
    const month = MONTH_NAMES[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Generate and Download PDF Report
  const handleGeneratePDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;

      // 1. Kop Surat Resmi JnC Family Care Metro
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(17, 24, 39);
      doc.text(
        "TEMPAT PRAKTIK MANDIRI BIDAN & KLINIK KELUARGA",
        pageWidth / 2,
        14,
        { align: "center" }
      );

      doc.setFontSize(16);
      doc.setTextColor(147, 51, 234); // Primary clinic purple
      doc.text("JnC FAMILY CARE METRO - MEIKA HEALTHCARE", pageWidth / 2, 21, {
        align: "center"
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(75, 85, 99);
      doc.text(
        "Pelayanan Terpadu Kesehatan Ibu, Bayi, dan Anak | Izin Operasional: 445/028/TPMB-METRO/2026",
        pageWidth / 2,
        26,
        { align: "center" }
      );
      doc.text(
        "Jl. Flamboyan No. 15, Metro Barat, Kota Metro, Lampung 34114 | Telp: (0725) 45678 | WA: 0812-3456-7890 | Email: info@meikahealth.id",
        pageWidth / 2,
        30,
        { align: "center" }
      );

      // Double Line Divider
      doc.setDrawColor(55, 65, 81);
      doc.setLineWidth(0.7);
      doc.line(margin, 33, pageWidth - margin, 33);
      doc.setLineWidth(0.2);
      doc.line(margin, 34, pageWidth - margin, 34);

      // 2. Report Heading
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(17, 24, 39);
      doc.text(
        "LAPORAN BULANAN REKAPITULASI PELAYANAN PASIEN",
        pageWidth / 2,
        41,
        { align: "center" }
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99);
      doc.text(
        `Periode Pelayanan: ${selectedMonthName} ${selectedYear}`,
        pageWidth / 2,
        46,
        { align: "center" }
      );

      // Filter note
      doc.setFontSize(8.5);
      doc.setTextColor(107, 114, 128);
      const filterNote = `Filter: Kategori (${selectedCategory}) • Praktisi (${selectedDoctor}) • Status (${selectedStatus})`;
      doc.text(filterNote, margin, 52);

      // 3. Summary Stat Boxes
      const boxWidth = (pageWidth - margin * 2 - 9) / 4;
      const boxHeight = 15;
      const boxY = 55;

      const summaryCards = [
        {
          label: "Total Kunjungan",
          value: `${stats.total} Pasien`,
          color: [243, 232, 255],
          border: [216, 180, 254],
          textColor: [126, 34, 206]
        },
        {
          label: "Selesai Dilayani",
          value: `${stats.selesai} Pasien (${stats.selesaiPercent}%)`,
          color: [240, 253, 244],
          border: [187, 247, 208],
          textColor: [21, 128, 61]
        },
        {
          label: "Dalam Proses / Panggil",
          value: `${stats.dipanggil} Pasien`,
          color: [239, 246, 255],
          border: [191, 219, 254],
          textColor: [29, 78, 216]
        },
        {
          label: "Menunggu Antrean",
          value: `${stats.menunggu} Pasien`,
          color: [255, 247, 237],
          border: [254, 215, 170],
          textColor: [194, 65, 12]
        }
      ];

      summaryCards.forEach((card, i) => {
        const x = margin + i * (boxWidth + 3);
        doc.setFillColor(...card.color);
        doc.setDrawColor(...card.border);
        doc.roundedRect(x, boxY, boxWidth, boxHeight, 2, 2, "FD");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(107, 114, 128);
        doc.text(card.label, x + 4, boxY + 5);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(...card.textColor);
        doc.text(card.value, x + 4, boxY + 11.5);
      });

      // 4. Data Table
      const tableData = filteredQueues.map((q, idx) => [
        idx + 1,
        q.queueNumber || "-",
        `${q.date || "-"} ${q.time ? `(${q.time})` : ""}`,
        q.patientName || "-",
        q.category || "-",
        q.service || "-",
        q.doctor || "-",
        q.status || "-"
      ]);

      autoTable(doc, {
        head: [
          [
            "No",
            "No. Antrean",
            "Tanggal & Waktu",
            "Nama Pasien",
            "Kategori",
            "Layanan Medis",
            "Praktisi Medis",
            "Status"
          ]
        ],
        body: tableData.length > 0 ? tableData : [["-", "-", "-", "Tidak ada data pada periode ini", "-", "-", "-", "-"]],
        startY: 74,
        margin: { left: margin, right: margin, bottom: 35 },
        theme: "striped",
        headStyles: {
          fillColor: [147, 51, 234], // Primary Purple
          textColor: 255,
          fontStyle: "bold",
          fontSize: 8.5,
          halign: "center",
          cellPadding: 2.5
        },
        styles: {
          fontSize: 8,
          cellPadding: 2.2,
          font: "helvetica",
          textColor: [31, 41, 55],
          lineColor: [229, 231, 235],
          lineWidth: 0.1
        },
        alternateRowStyles: {
          fillColor: [250, 245, 255]
        },
        columnStyles: {
          0: { cellWidth: 10, halign: "center" },
          1: { cellWidth: 24, halign: "center", fontStyle: "bold", textColor: [126, 34, 206] },
          2: { cellWidth: 36, halign: "left" },
          3: { cellWidth: 44, fontStyle: "bold" },
          4: { cellWidth: 38 },
          5: { cellWidth: 48 },
          6: { cellWidth: 45 },
          7: { cellWidth: 24, halign: "center" }
        },
        didDrawPage: (data) => {
          // Page Footer
          const pageNum = doc.internal.getNumberOfPages();
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(156, 163, 175);
          doc.text(
            `JnC Family Care Metro - Sistem Informasi Pelayanan Pasien | Dicetak pada: ${getIndonesianFullDate()}`,
            margin,
            pageHeight - 8
          );
          doc.text(
            `Halaman ${data.pageNumber} dari ${pageNum}`,
            pageWidth - margin,
            pageHeight - 8,
            { align: "right" }
          );
        }
      });

      // 5. Signature Section (on the last page)
      const finalY = doc.lastAutoTable.finalY || 150;
      let signatureY = finalY + 12;

      // If signature doesn't fit on current page, add new page
      if (signatureY + 35 > pageHeight - 15) {
        doc.addPage();
        signatureY = 25;
      }

      const sigX = pageWidth - margin - 60;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(31, 41, 55);
      doc.text(`Kota Metro, ${getIndonesianFullDate()}`, sigX, signatureY, {
        align: "center"
      });
      doc.setFont("helvetica", "bold");
      doc.text("Kepala JnC Family Care Metro", sigX, signatureY + 5, {
        align: "center"
      });

      // Blank space for stamp & signature
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(17, 24, 39);
      doc.text("dr. Aulia Rahma, Sp.OG", sigX, signatureY + 28, {
        align: "center"
      });
      doc.setLineWidth(0.2);
      doc.line(sigX - 25, signatureY + 29, sigX + 25, signatureY + 29);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text("SIP: 446/089/D.KES/2026", sigX, signatureY + 33, {
        align: "center"
      });

      // Download PDF
      const filename = `Laporan_Bulanan_JnC_Family_Care_${selectedMonthName}_${selectedYear}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Gagal membuat dokumen PDF: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      {/* 1. Header Tab */}
      <div className={styles.header}>
        <Title
          title="Laporan Bulanan Pelayanan"
          desc="Rekapitulasi berkala kunjungan pasien, efektivitas praktisi medis, sebaran kategori layanan, dan cetak ekspor dokumen resmi PDF."
        />
      </div>

      {/* 2. Filter & Periode Controls Card */}
      <div className={styles.filterCard}>
        <div className={styles.filterCardHeader}>
          <div>
            <h4 className={styles.filterCardTitle}>Parameter & Periode Laporan</h4>
            <p className={styles.filterCardSubtitle}>
              Pilih bulan, tahun, dan kriteria penyaringan untuk melihat dan mencetak rekapitulasi data.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Button
              variant="secondary"
              onClick={() => setIsPreviewOpen(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Pratinjau Dokumen
            </Button>
            <Button
              onClick={handleGeneratePDF}
              disabled={isExporting}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {isExporting ? "Membuat PDF..." : "Cetak / Unduh PDF"}
            </Button>
          </div>
        </div>

        <div className={styles.filterGrid}>
          <div>
            <InputSelect
              label="Bulan"
              options={MONTH_OPTIONS}
              value={selectedMonth}
              onChange={(val) => setSelectedMonth(val)}
              placeholder="Pilih Bulan"
            />
          </div>
          <div>
            <InputSelect
              label="Tahun"
              options={YEAR_OPTIONS}
              value={selectedYear}
              onChange={(val) => setSelectedYear(val)}
              placeholder="Pilih Tahun"
            />
          </div>
          <div>
            <InputSelect
              label="Kategori Layanan"
              options={categoryOptions}
              value={selectedCategory}
              onChange={(val) => setSelectedCategory(val)}
              placeholder="Semua Kategori"
            />
          </div>
          <div>
            <InputSelect
              label="Praktisi Medis"
              options={doctorOptions}
              value={selectedDoctor}
              onChange={(val) => setSelectedDoctor(val)}
              placeholder="Semua Praktisi"
            />
          </div>
          <div>
            <InputSelect
              label="Status Pelayanan"
              options={STATUS_OPTIONS}
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val)}
              placeholder="Semua Status"
            />
          </div>
        </div>
      </div>

      {/* 3. Stat Cards Grid (Identical to Overview Grid) */}
      <div className={styles.overviewGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Kunjungan Periode Ini</span>
          <span className={styles.statValue}>{stats.total} Pasien</span>
          <span className={styles.statDesc}>
            Bulan {selectedMonthName} {selectedYear}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Pelayanan Selesai</span>
          <span className={styles.statValue}>
            {stats.selesai} Pasien ({stats.selesaiPercent}%)
          </span>
          <span className={styles.statDesc}>Konsultasi & treatment tuntas</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Layanan Terpopuler</span>
          <span
            className={styles.statValue}
            style={{ fontSize: stats.topService.name.length > 20 ? "18px" : "24px" }}
          >
            {stats.topService.name}
          </span>
          <span className={styles.statDesc}>
            {stats.topService.count > 0 ? `${stats.topService.count} Pasien terlayani` : "Belum ada data"}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Praktisi Teraktif</span>
          <span
            className={styles.statValue}
            style={{ fontSize: stats.topDoctor.name.length > 20 ? "18px" : "24px" }}
          >
            {stats.topDoctor.name}
          </span>
          <span className={styles.statDesc}>
            {stats.topDoctor.count > 0 ? `${stats.topDoctor.count} Pasien ditangani` : "Belum ada data"}
          </span>
        </div>
      </div>

      {/* 4. Two Column Breakdown Grid (Status & Categories) */}
      <div className={styles.twoColumnGrid}>
        {/* Status Breakdown */}
        <div className={styles.cardSection}>
          <p className={styles.title} style={{ fontSize: "18px", margin: 0 }}>
            Status Pelayanan Pasien ({selectedMonthName} {selectedYear})
          </p>

          {/* Selesai */}
          <div className={styles.progressItem}>
            <div className={styles.progressLabelRow}>
              <span>Selesai Konsultasi / Tindakan</span>
              <span>
                {stats.selesai} Pasien ({stats.selesaiPercent}%)
              </span>
            </div>
            <div className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{
                  width: stats.total > 0 ? `${(stats.selesai / stats.total) * 100}%` : "0%",
                  backgroundColor: "#15803d"
                }}
              />
            </div>
          </div>

          {/* Sedang Dilayani / Dipanggil */}
          <div className={styles.progressItem}>
            <div className={styles.progressLabelRow}>
              <span>Sedang Dipanggil / Pelayanan</span>
              <span>{stats.dipanggil} Pasien</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{
                  width: stats.total > 0 ? `${(stats.dipanggil / stats.total) * 100}%` : "0%",
                  backgroundColor: "var(--primary)"
                }}
              />
            </div>
          </div>

          {/* Menunggu Antrean */}
          <div className={styles.progressItem}>
            <div className={styles.progressLabelRow}>
              <span>Menunggu Antrean</span>
              <span>{stats.menunggu} Pasien</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{
                  width: stats.total > 0 ? `${(stats.menunggu / stats.total) * 100}%` : "0%",
                  backgroundColor: "#c2410c"
                }}
              />
            </div>
          </div>

          {/* Dibatalkan */}
          <div className={styles.progressItem}>
            <div className={styles.progressLabelRow}>
              <span>Dibatalkan</span>
              <span>{stats.batal} Pasien</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{
                  width: stats.total > 0 ? `${(stats.batal / stats.total) * 100}%` : "0%",
                  backgroundColor: "#9ca3af"
                }}
              />
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className={styles.cardSection}>
          <p className={styles.title} style={{ fontSize: "18px", margin: 0 }}>
            Distribusi Layanan per Kategori
          </p>

          {Object.entries(stats.categoryCounts).map(([catName, count]) => {
            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
            return (
              <div className={styles.progressItem} key={catName}>
                <div className={styles.progressLabelRow}>
                  <span>{catName}</span>
                  <span>
                    {count} Pasien ({pct}%)
                  </span>
                </div>
                <div className={styles.progressBarTrack}>
                  <div
                    className={styles.progressBarFill}
                    style={{
                      width: `${pct}%`,
                      backgroundColor: "var(--primary)"
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Detailed Patient Visit Records Table */}
      <div className={styles.inputContainer}>
        <Table
          title={`Rincian Kunjungan Pasien (${selectedMonthName} ${selectedYear})`}
          isLoading={isLoading}
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
              </div>
              <div className={styles.tableCtaGroup}>
                <Button onClick={handleGeneratePDF} disabled={isExporting}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: "6px", verticalAlign: "middle" }}
                  >
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {isExporting ? "Membuat PDF..." : "Unduh PDF Laporan"}
                </Button>
              </div>
            </div>
          }
          emptyMessage={`Tidak ada data catatan pelayanan pasien pada periode ${selectedMonthName} ${selectedYear} dengan filter yang dipilih.`}
        >
          <thead>
            <tr>
              <th style={{ width: "40px" }}>No</th>
              <th>No. Antrean</th>
              <th>Tanggal & Waktu</th>
              <th>Nama Pasien</th>
              <th>Kategori</th>
              <th>Jenis Layanan</th>
              <th>Dokter / Bidan</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueues.length > 0 ? (
              filteredQueues.map((q, idx) => (
                <tr key={q.id || idx}>
                  <td>{idx + 1}</td>
                  <td style={{ fontWeight: "600", color: "var(--primary)" }}>{q.queueNumber}</td>
                  <td>
                    {q.date} • {q.time}
                  </td>
                  <td style={{ fontWeight: "500" }}>{q.patientName}</td>
                  <td>
                    <span className={styles.categoryBadge}>{q.category}</span>
                  </td>
                  <td>{q.service}</td>
                  <td>{q.doctor}</td>
                  <td>
                    <TableBadge status={q.status} />
                  </td>
                </tr>
              ))
            ) : null}
          </tbody>
        </Table>
      </div>

      {/* 6. Document Preview Modal */}
      {isPreviewOpen && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title="Pratinjau Dokumen Laporan Bulanan"
          subtitle={`Format Dokumen Resmi PDF - Periode: ${selectedMonthName} ${selectedYear}`}
          maxWidth="900px"
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", width: "100%" }}>
              <Button variant="secondary" onClick={() => setIsPreviewOpen(false)}>
                Tutup Pratinjau
              </Button>
              <Button onClick={handleGeneratePDF} disabled={isExporting}>
                {isExporting ? "Memproses PDF..." : "Unduh Dokumen PDF Resmi"}
              </Button>
            </div>
          }
        >
          <div className={styles.previewDocWrapper}>
            {/* Kop Surat */}
            <div className={styles.kopSurat}>
              <h3 className={styles.kopClinicName}>TEMPAT PRAKTIK MANDIRI BIDAN & KLINIK KELUARGA</h3>
              <p className={styles.kopClinicSubtitle}>JnC FAMILY CARE METRO - MEIKA HEALTHCARE</p>
              <p className={styles.kopClinicAddress}>
                Pelayanan Terpadu Kesehatan Ibu, Bayi, dan Anak | Izin Operasional: 445/028/TPMB-METRO/2026<br />
                Jl. Flamboyan No. 15, Metro Barat, Kota Metro, Lampung 34114 | Telp: (0725) 45678
              </p>
            </div>

            {/* Report Heading */}
            <div className={styles.reportHeading}>
              <h4 className={styles.reportTitle}>LAPORAN BULANAN REKAPITULASI PELAYANAN PASIEN</h4>
              <p className={styles.reportPeriod}>Periode: {selectedMonthName} {selectedYear}</p>
            </div>

            {/* Summary Grid in Preview */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "12px",
                marginBottom: "20px"
              }}
            >
              <div style={{ background: "white", padding: "12px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                <span style={{ fontSize: "11px", color: "#6b7280" }}>Total Kunjungan</span>
                <p style={{ fontSize: "16px", fontWeight: "700", margin: "4px 0 0 0", color: "#7e22ce" }}>
                  {stats.total} Pasien
                </p>
              </div>
              <div style={{ background: "white", padding: "12px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                <span style={{ fontSize: "11px", color: "#6b7280" }}>Selesai Dilayani</span>
                <p style={{ fontSize: "16px", fontWeight: "700", margin: "4px 0 0 0", color: "#15803d" }}>
                  {stats.selesai} Pasien ({stats.selesaiPercent}%)
                </p>
              </div>
              <div style={{ background: "white", padding: "12px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                <span style={{ fontSize: "11px", color: "#6b7280" }}>Dalam Pelayanan</span>
                <p style={{ fontSize: "16px", fontWeight: "700", margin: "4px 0 0 0", color: "#1d4ed8" }}>
                  {stats.dipanggil} Pasien
                </p>
              </div>
              <div style={{ background: "white", padding: "12px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                <span style={{ fontSize: "11px", color: "#6b7280" }}>Menunggu Antrean</span>
                <p style={{ fontSize: "16px", fontWeight: "700", margin: "4px 0 0 0", color: "#c2410c" }}>
                  {stats.menunggu} Pasien
                </p>
              </div>
            </div>

            {/* Preview Mini Table */}
            <div style={{ overflowX: "auto", background: "white", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ background: "#9333ea", color: "white", textAlign: "left" }}>
                    <th style={{ padding: "8px 12px" }}>No</th>
                    <th style={{ padding: "8px 12px" }}>Antrean</th>
                    <th style={{ padding: "8px 12px" }}>Tanggal</th>
                    <th style={{ padding: "8px 12px" }}>Pasien</th>
                    <th style={{ padding: "8px 12px" }}>Kategori</th>
                    <th style={{ padding: "8px 12px" }}>Layanan</th>
                    <th style={{ padding: "8px 12px" }}>Praktisi</th>
                    <th style={{ padding: "8px 12px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueues.slice(0, 8).map((q, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6", background: idx % 2 === 1 ? "#faf5ff" : "white" }}>
                      <td style={{ padding: "8px 12px" }}>{idx + 1}</td>
                      <td style={{ padding: "8px 12px", fontWeight: "600", color: "#7e22ce" }}>{q.queueNumber}</td>
                      <td style={{ padding: "8px 12px" }}>{q.date}</td>
                      <td style={{ padding: "8px 12px", fontWeight: "500" }}>{q.patientName}</td>
                      <td style={{ padding: "8px 12px" }}>{q.category}</td>
                      <td style={{ padding: "8px 12px" }}>{q.service}</td>
                      <td style={{ padding: "8px 12px" }}>{q.doctor}</td>
                      <td style={{ padding: "8px 12px" }}>
                        <TableBadge status={q.status} />
                      </td>
                    </tr>
                  ))}
                  {filteredQueues.length > 8 && (
                    <tr>
                      <td colSpan={8} style={{ padding: "10px", textAlign: "center", color: "#6b7280", fontStyle: "italic" }}>
                        ... dan {filteredQueues.length - 8} data lainnya tercantum dalam dokumen PDF lengkap.
                      </td>
                    </tr>
                  )}
                  {filteredQueues.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ padding: "16px", textAlign: "center", color: "#9ca3af" }}>
                        Tidak ada data pelayanan pada periode terpilih.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Signature Preview */}
            <div className={styles.signatureSection}>
              <div className={styles.signatureBox}>
                <p className={styles.signatureDate}>Kota Metro, {getIndonesianFullDate()}</p>
                <p className={styles.signatureRole}>Kepala Klinik JnC Family Care</p>
                <p className={styles.signatureName}>dr. Aulia Rahma, Sp.OG</p>
                <p className={styles.signatureNip}>SIP: 446/089/D.KES/2026</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
