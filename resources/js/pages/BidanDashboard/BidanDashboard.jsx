import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BidanDashboard.module.css";
import Button from "../../components/Button/Button";
import InputText from "../../components/Input/InputText";
import InputSelect from "../../components/Input/InputSelect";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import { apiService } from "../../services/apiService";

export default function BidanDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("overview"); // 'overview', 'antrean', 'jadwal', 'profil'
  const [queues, setQueues] = useState([]);
  const [mySchedule, setMySchedule] = useState({
    doctor: "Bidan Siti Rahmawati, S.Tr.Keb",
    role: "Bidan Senior & Treatment Specialist",
    startDay: "Senin",
    endDay: "Sabtu",
    startTime: "08:00",
    endTime: "16:00",
    strNumber: "STR-BIDAN-2026-88912",
    services: ["Pemeriksaan Kehamilan", "Treatment Laktasi", "Baby Spa", "Pelayanan Persalinan"]
  });

  const [notes, setNotes] = useState({});
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [tempNoteText, setTempNoteText] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      navigate("/login", { replace: true });
      return;
    }

    const isBidan = loggedInUser.toLowerCase().includes("bidan") || loggedInUser.toLowerCase().includes("praktisi");
    if (!isBidan) {
      navigate("/login", { replace: true });
      return;
    }

    async function loadQueues() {
      const data = await apiService.getQueues();
      setQueues(data);
    }
    loadQueues();
  }, [navigate]);

  const handleStatusChange = async (id, newStatus) => {
    const updated = queues.map((q) => (q.id === id ? { ...q, status: newStatus } : q));
    setQueues(updated);
    apiService.saveQueuesLocal(updated);
    await apiService.updateQueue(id, { status: newStatus });
    setSuccessMsg("Status antrean berhasil diperbarui!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleSaveNote = (id) => {
    setNotes({ ...notes, [id]: tempNoteText });
    setEditingNoteId(null);
    setTempNoteText("");
    setSuccessMsg("Catatan medis pasien berhasil disimpan!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login", { replace: true });
  };

  const getTodayStr = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const getTomorrowStr = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const y = tomorrow.getFullYear();
    const m = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const d = String(tomorrow.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const parseToTimestamp = (dateStr) => {
    if (!dateStr) return "";
    const lower = String(dateStr).toLowerCase().trim();
    if (lower === "hari ini" || lower === "today") return getTodayStr();
    if (lower === "besok" || lower === "tomorrow") return getTomorrowStr();

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [d, m, y] = dateStr.split("/");
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }

    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }

    return dateStr;
  };

  const [queueDateFilter, setQueueDateFilter] = useState(getTodayStr());

  const todayTimestamp = getTodayStr();
  const todayQueues = queues.filter((q) => parseToTimestamp(q.date) === todayTimestamp);

  const filteredQueues = queues.filter((q) => {
    if (!queueDateFilter || queueDateFilter === "Semua") return true;
    return parseToTimestamp(q.date) === parseToTimestamp(queueDateFilter);
  });

  const pendingQueues = todayQueues.filter((q) => q.status === "Menunggu Antrean" || q.status === "Dipanggil");
  const servingQueues = todayQueues.filter((q) => q.status === "Sedang Dilayani");
  const finishedQueues = todayQueues.filter((q) => q.status === "Selesai");

  const bidanMenuItems = [
    { id: "overview", label: "Dashboard Ringkasan" },
    { id: "antrean", label: `Antrean Pasien Saya (${filteredQueues.length})` },
    { id: "jadwal", label: "Jadwal Praktik & Layanan" },
    { id: "profil", label: "Profil Praktisi Medis" }
  ];

  return (
    <DashboardLayout
      menuItems={bidanMenuItems}
      activeMenu={activeMenu}
      onMenuChange={setActiveMenu}
      userInfo={{
        title: `Halo, ${mySchedule.doctor}`,
        badge: "Bidan / Praktisi Medis",
        subtitle: mySchedule.role
      }}
      onLogout={handleLogout}
    >
      {successMsg && (
        <div style={{ padding: "12px 20px", background: "#d1fae5", color: "#047857", borderRadius: "12px", fontFamily: "var(--artico)", fontWeight: "600", marginBottom: "24px" }}>
          {successMsg}
        </div>
      )}

      {activeMenu === "overview" && (
        <>
          <div className={styles.header}>
            <p className={styles.title}>Dasbor Pelayanan Bidan / Praktisi Medis</p>
            <p className={styles.desc}>Selamat bertugas! Pantau dan kelola kehadiran pasien serta rekam catatan pelayanan hari ini.</p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statTitle}>Total Pasien Hari Ini</span>
              <span className={styles.statValue}>{todayQueues.length}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statTitle}>Menunggu Pelayanan</span>
              <span className={styles.statValue} style={{ color: "#d97706" }}>{pendingQueues.length}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statTitle}>Sedang Dilayani</span>
              <span className={styles.statValue} style={{ color: "#2563eb" }}>{servingQueues.length}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statTitle}>Selesai Dilayani</span>
              <span className={styles.statValue} style={{ color: "#059669" }}>{finishedQueues.length}</span>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
              <h3 className={styles.tableTitle}>Daftar Antrean Pasien Hari Ini</h3>
              <Button size="sm" onClick={() => setActiveMenu("antrean")}>Lihat Semua Antrean</Button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No. Antrean</th>
                  <th>Nama Pasien</th>
                  <th>Layanan Medis</th>
                  <th>Waktu Kunjungan</th>
                  <th>Status Antrean</th>
                  <th>Aksi Bidan</th>
                </tr>
              </thead>
              <tbody>
                {todayQueues.slice(0, 5).map((item) => (
                        <tr key={item.id}>
                          <td><strong>{item.queueNumber || item.queue_number}</strong></td>
                          <td>{item.patientName || item.patient_name}</td>
                          <td>{item.service || item.service_name}</td>
                          <td>{item.time || "09:00 WIB"}</td>
                          <td>
                            <span className={`${styles.statusBadge} ${
                              item.status === "Sedang Dilayani" ? styles.statusProses :
                              item.status === "Selesai" ? styles.statusSelesai :
                              item.status === "Dibatalkan" ? styles.statusBatal : styles.statusMenunggu
                            }`}>
                              {item.status || "Menunggu Antrean"}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actionButtons}>
                              <Button size="sm" variant="secondary" onClick={() => handleStatusChange(item.id, "Sedang Dilayani")}>Panggil</Button>
                              <Button size="sm" onClick={() => handleStatusChange(item.id, "Selesai")}>Selesai</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeMenu === "antrean" && (
              <>
                <div className={styles.header}>
                  <p className={styles.title}>Manajemen Antrean & Catatan Pelayanan Pasien</p>
                  <p className={styles.desc}>Kelola status kehadiran pasien dan berikan catatan rekam pelayanan medis.</p>
                </div>

                <div className={styles.tableWrapper}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 className={styles.tableTitle}>Daftar Antrean Pasien</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "14px", fontFamily: "var(--artico)", color: "#4b5563" }}>Filter Tanggal:</span>
                      <select
                        value={queueDateFilter}
                        onChange={(e) => setQueueDateFilter(e.target.value)}
                        style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontFamily: "var(--artico)", fontSize: "14px" }}
                      >
                        <option value={getTodayStr()}>Hari Ini ({getTodayStr()})</option>
                        <option value={getTomorrowStr()}>Besok ({getTomorrowStr()})</option>
                        <option value="Semua">Semua Tanggal</option>
                      </select>
                    </div>
                  </div>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>No. Antrean</th>
                        <th>Nama Pasien</th>
                        <th>Praktisi Medis</th>
                        <th>Layanan</th>
                        <th>Status</th>
                        <th>Catatan Bidan</th>
                        <th>Aksi Ubah Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQueues.map((item) => (
                        <tr key={item.id}>
                          <td><strong>{item.queueNumber || item.queue_number}</strong></td>
                          <td>{item.patientName || item.patient_name}</td>
                          <td>{item.doctor || item.doctor_name}</td>
                          <td>{item.service || item.service_name}</td>
                          <td>
                            <span className={`${styles.statusBadge} ${
                              item.status === "Sedang Dilayani" ? styles.statusProses :
                              item.status === "Selesai" ? styles.statusSelesai :
                              item.status === "Dibatalkan" ? styles.statusBatal : styles.statusMenunggu
                            }`}>
                              {item.status || "Menunggu Antrean"}
                            </span>
                          </td>
                          <td>
                            {notes[item.id] ? (
                              <span style={{ fontSize: "13px", color: "#374151" }}>{notes[item.id]}</span>
                            ) : editingNoteId === item.id ? (
                              <div style={{ display: "flex", gap: "4px" }}>
                                <input
                                  type="text"
                                  placeholder="Tulis catatan..."
                                  value={tempNoteText}
                                  onChange={(e) => setTempNoteText(e.target.value)}
                                  style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid #ccc" }}
                                />
                                <Button size="sm" onClick={() => handleSaveNote(item.id)}>Simpan</Button>
                              </div>
                            ) : (
                              <button
                                style={{ background: "none", border: "none", color: "#db2777", cursor: "pointer", textDecoration: "underline", fontSize: "13px" }}
                                onClick={() => { setEditingNoteId(item.id); setTempNoteText(""); }}
                              >
                                + Catatan
                              </button>
                            )}
                          </td>
                          <td>
                            <div className={styles.actionButtons}>
                              <Button size="sm" variant="secondary" onClick={() => handleStatusChange(item.id, "Sedang Dilayani")}>Layani</Button>
                              <Button size="sm" onClick={() => handleStatusChange(item.id, "Selesai")}>Selesai</Button>
                              <Button size="sm" variant="secondary" onClick={() => handleStatusChange(item.id, "Dibatalkan")}>Batal</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeMenu === "jadwal" && (
              <>
                <div className={styles.header}>
                  <p className={styles.title}>Jadwal Praktik & Jenis Layanan Medis</p>
                  <p className={styles.desc}>Informasi jadwal kerja harian dan layanan kebidanan yang aktif ditangani.</p>
                </div>

                <div className={styles.formCard}>
                  <h3>Pengaturan Hari & Jam Kerja Bidan</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <InputText label="Hari Mulai Praktik" value={mySchedule.startDay} onChange={(e) => setMySchedule({ ...mySchedule, startDay: e.target.value })} />
                    <InputText label="Hari Selesai Praktik" value={mySchedule.endDay} onChange={(e) => setMySchedule({ ...mySchedule, endDay: e.target.value })} />
                    <InputText label="Jam Mulai Praktik" value={mySchedule.startTime} onChange={(e) => setMySchedule({ ...mySchedule, startTime: e.target.value })} />
                    <InputText label="Jam Selesai Praktik" value={mySchedule.endTime} onChange={(e) => setMySchedule({ ...mySchedule, endTime: e.target.value })} />
                  </div>
                  <div>
                    <h4 style={{ margin: "12px 0 8px 0" }}>Layanan Kebidanan & Care yang Ditangani:</h4>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {mySchedule.services.map((s, idx) => (
                        <span key={idx} style={{ background: "#fbcfe8", color: "#831843", padding: "6px 14px", borderRadius: "9999px", fontSize: "13px", fontWeight: "600" }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button onClick={() => { setSuccessMsg("Jadwal praktik berhasil diperbarui!"); setTimeout(() => setSuccessMsg(""), 3000); }}>
                    Simpan Perubahan Jadwal
                  </Button>
                </div>
              </>
            )}

            {activeMenu === "profil" && (
              <>
                <div className={styles.header}>
                  <p className={styles.title}>Profil Identitas Bidan / Praktisi Medis</p>
                  <p className={styles.desc}>Kelola data kredensial praktisi dan Surat Izin Praktik (STR/SIP).</p>
                </div>

                <div className={styles.formCard}>
                  <InputText label="Nama Lengkap & Gelar Bidan" value={mySchedule.doctor} onChange={(e) => setMySchedule({ ...mySchedule, doctor: e.target.value })} />
                  <InputText label="Peran / Spesialisasi Medis" value={mySchedule.role} onChange={(e) => setMySchedule({ ...mySchedule, role: e.target.value })} />
                  <InputText label="Nomor Surat Tanda Registrasi (STR/SIP)" value={mySchedule.strNumber} onChange={(e) => setMySchedule({ ...mySchedule, strNumber: e.target.value })} />
                  <Button onClick={() => { setSuccessMsg("Profil bidan berhasil diperbarui!"); setTimeout(() => setSuccessMsg(""), 3000); }}>
                    Simpan Profil Bidan
                  </Button>
                </div>
              </>
            )}
    </DashboardLayout>
  );
}
