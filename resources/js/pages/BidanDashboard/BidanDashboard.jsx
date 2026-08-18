import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BidanDashboard.module.css";
import Button from "../../components/Button/Button";
import InputText from "../../components/Input/InputText";
import InputSelect from "../../components/Input/InputSelect";
import InputImage from "../../components/Input/InputImage";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import { apiService } from "../../services/apiService";
import Table, { TableBadge } from "../../components/Table/Table";
import Title from "../../components/Title/Title";

export default function BidanDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("overview"); // 'overview', 'antrean', 'jadwal', 'profil'
  const [queues, setQueues] = useState([]);
  const [mySchedule, setMySchedule] = useState({
    id: null,
    doctor: "Bidan Siti Rahmawati, S.Tr.Keb",
    role: "Bidan Senior & Treatment Specialist",
    image: "/img/landingPage/dummyDr.png",
    startDay: "Senin",
    endDay: "Sabtu",
    startTime: "08:00",
    endTime: "16:00",
    strNumber: "STR-BIDAN-2026-88912",
    services: ["Pemeriksaan Kehamilan", "Treatment Laktasi", "Baby Spa", "Pelayanan Persalinan"]
  });

  const [availableClinicServices, setAvailableClinicServices] = useState([]);
  const [selectedServiceToSelect, setSelectedServiceToSelect] = useState("");
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

    const isBidan =
      loggedInUser.toLowerCase().includes("bidan") ||
      loggedInUser.toLowerCase().includes("praktisi") ||
      loggedInUser.toLowerCase().includes("dokter") ||
      loggedInUser.toLowerCase().includes("dr.");

    if (!isBidan) {
      navigate("/login", { replace: true });
      return;
    }

    async function loadData() {
      const queueData = await apiService.getQueues();
      setQueues(queueData);

      const categoriesData = await apiService.getCategories();
      const allClinicServices = Array.from(
        new Set((categoriesData || []).flatMap((cat) => cat.services || []))
      );
      setAvailableClinicServices(allClinicServices);

      const doctorsData = await apiService.getDoctors();
      if (Array.isArray(doctorsData) && doctorsData.length > 0) {
        const matchedDoc = doctorsData.find((doc) => {
          const docName = (doc.doctor || "").toLowerCase();
          const docUser = (doc.username || "").toLowerCase();
          const logged = loggedInUser.toLowerCase();
          return logged.includes(docUser) || docName.includes(logged) || logged.includes(docName.split(" ")[0]);
        }) || doctorsData[0];

        if (matchedDoc) {
          const firstSchedule = matchedDoc.schedules?.[0] || {};
          const days = firstSchedule.days || [];
          setMySchedule({
            id: matchedDoc.id || null,
            doctor: matchedDoc.doctor || "Bidan Siti Rahmawati, S.Tr.Keb",
            role: matchedDoc.role || "Bidan Senior & Treatment Specialist",
            image: matchedDoc.image || "/img/landingPage/dummyDr.png",
            startDay: matchedDoc.startDay || days[0] || "Senin",
            endDay: matchedDoc.endDay || days[days.length - 1] || "Sabtu",
            startTime: matchedDoc.startTime || firstSchedule.startTime || "08:00",
            endTime: matchedDoc.endTime || firstSchedule.endTime || "16:00",
            strNumber: matchedDoc.strNumber || "STR-BIDAN-2026-88912",
            services: matchedDoc.services || firstSchedule.services || ["Pemeriksaan Kehamilan", "Treatment Laktasi", "Baby Spa", "Pelayanan Persalinan"]
          });
        }
      }
    }
    loadData();
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
    {
      id: "overview", label: "Overview", svg:
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 6V0H18V6H10ZM0 10V0H8V10H0ZM10 18V8H18V18H10ZM0 18V12H8V18H0Z" fill="currentColor" />
        </svg>
    },
    {
      id: "antrean", label: `Antrean Pasien Saya`, svg:
        <svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.102 6.34707V8.07807H1.904V1.87207H0V14.2861H1.904V11.4491H22.102V14.5231H24V6.34507L22.102 6.34707Z" fill="currentColor" />
          <path d="M8.709 6.365C8.709 6.929 8.252 7.387 7.687 7.387H3.793C3.65871 7.38726 3.5257 7.36101 3.40158 7.30974C3.27747 7.25848 3.1647 7.18321 3.06975 7.08825C2.97479 6.9933 2.89952 6.88053 2.84826 6.75641C2.79699 6.6323 2.77073 6.49928 2.771 6.365V6.363C2.771 5.799 3.228 5.341 3.793 5.341H7.687C8.251 5.341 8.709 5.798 8.709 6.363V6.365ZM19.743 2.364H17.373V0H15.693V2.365H13.328V4.045H15.692V6.41H17.372V4.045H19.742L19.743 2.364Z" fill="white" />
        </svg>
    },
    {
      id: "jadwal", label: "Jadwal Praktik & Layanan", svg:
        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.01 0.00999999H1C0.733626 0.0118505 0.478833 0.119173 0.29141 0.30847C0.103987 0.497768 -0.00079548 0.753616 4.54779e-06 1.02V6.6C4.54779e-06 6.79 0.0500045 6.97 0.150005 7.13C0.250005 7.29 0.390004 7.42 0.550004 7.51L5.33 10.35C5.54 10.46 5.77 10.51 6 10.51C6.23 10.51 6.46 10.46 6.67 10.35L11.45 7.51C11.62 7.42 11.76 7.29 11.85 7.13C11.95 6.97 12 6.79 12 6.6V1.02C12 0.89 11.98 0.76 11.93 0.63C11.88 0.51 11.81 0.4 11.72 0.3C11.5354 0.111586 11.2838 0.00375705 11.02 0L11.01 0.00999999ZM9.01 5.51H7.01V7.51H5.01V5.51H3.01V3.51H5.01V1.51H7.01V3.51H9.01V5.51Z" fill="currentColor" />
        </svg>
    },
    {
      id: "profil", label: "Profil Praktisi Medis", svg:
        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 8C8.06087 8 9.07828 7.57857 9.82843 6.82843C10.5786 6.07828 11 5.06087 11 4C11 2.93913 10.5786 1.92172 9.82843 1.17157C9.07828 0.421427 8.06087 0 7 0C5.93913 0 4.92172 0.421427 4.17157 1.17157C3.42143 1.92172 3 2.93913 3 4C3 5.06087 3.42143 6.07828 4.17157 6.82843C4.92172 7.57857 5.93913 8 7 8ZM4 9.725C1.6875 10.4031 0 12.5406 0 15.0719C0 15.5844 0.415625 16 0.928125 16H13.0719C13.5844 16 14 15.5844 14 15.0719C14 12.5406 12.3125 10.4031 10 9.725V11.3125C10.8625 11.5344 11.5 12.3188 11.5 13.25V14.5C11.5 14.775 11.275 15 11 15H10.5C10.225 15 10 14.775 10 14.5C10 14.225 10.225 14 10.5 14V13.25C10.5 12.6969 10.0531 12.25 9.5 12.25C8.94687 12.25 8.5 12.6969 8.5 13.25V14C8.775 14 9 14.225 9 14.5C9 14.775 8.775 15 8.5 15H8C7.725 15 7.5 14.775 7.5 14.5V13.25C7.5 12.3188 8.1375 11.5344 9 11.3125V9.52812C8.8125 9.50937 8.62188 9.5 8.42813 9.5H5.57188C5.37813 9.5 5.1875 9.50937 5 9.52812V11.5719C5.72188 11.7875 6.25 12.4563 6.25 13.25C6.25 14.2156 5.46562 15 4.5 15C3.53438 15 2.75 14.2156 2.75 13.25C2.75 12.4563 3.27812 11.7875 4 11.5719V9.725ZM4.5 14C4.69891 14 4.88968 13.921 5.03033 13.7803C5.17098 13.6397 5.25 13.4489 5.25 13.25C5.25 13.0511 5.17098 12.8603 5.03033 12.7197C4.88968 12.579 4.69891 12.5 4.5 12.5C4.30109 12.5 4.11032 12.579 3.96967 12.7197C3.82902 12.8603 3.75 13.0511 3.75 13.25C3.75 13.4489 3.82902 13.6397 3.96967 13.7803C4.11032 13.921 4.30109 14 4.5 14Z" fill="currentColor" />
        </svg>
    }
  ];

  const DAYS_OF_WEEK = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const getDaysRange = (start, end) => {
    const startIndex = DAYS_OF_WEEK.indexOf(start);
    const endIndex = DAYS_OF_WEEK.indexOf(end);
    if (startIndex === -1 || endIndex === -1) return [start, end];
    if (startIndex <= endIndex) {
      return DAYS_OF_WEEK.slice(startIndex, endIndex + 1);
    }
    return [...DAYS_OF_WEEK.slice(startIndex), ...DAYS_OF_WEEK.slice(0, endIndex + 1)];
  };

  const handleSaveSchedule = async () => {
    const doctorsData = await apiService.getDoctors();
    const startDay = mySchedule.startDay || "Senin";
    const endDay = mySchedule.endDay || "Jumat";
    const startTime = mySchedule.startTime || "08:00";
    const endTime = mySchedule.endTime || "14:00";
    const daysList = getDaysRange(startDay, endDay);
    const displayDays = startDay === endDay ? startDay : `${startDay} - ${endDay}`;
    const servicesList = mySchedule.services && mySchedule.services.length > 0 ? mySchedule.services : ["Pemeriksaan Kehamilan"];

    const updated = doctorsData.map((doc) => {
      if (doc.doctor === mySchedule.doctor || doc.id === mySchedule.id) {
        return {
          ...doc,
          startDay: startDay,
          endDay: endDay,
          startTime: startTime,
          endTime: endTime,
          services: servicesList,
          schedules: [
            {
              days: daysList,
              displayDays: displayDays,
              startTime: startTime,
              endTime: endTime,
              services: servicesList
            }
          ]
        };
      }
      return doc;
    });

    apiService.saveDoctorsLocal(updated);

    if (mySchedule.id) {
      await apiService.updateDoctor(mySchedule.id, {
        startDay: startDay,
        endDay: endDay,
        startTime: startTime,
        endTime: endTime,
        services: servicesList
      });
    }

    setSuccessMsg("Jadwal praktik & daftar layanan berhasil diperbarui!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleSaveProfile = async () => {
    const doctorsData = await apiService.getDoctors();
    const updated = doctorsData.map((doc) => {
      if (doc.doctor === mySchedule.doctor || doc.id === mySchedule.id) {
        return {
          ...doc,
          doctor: mySchedule.doctor,
          role: mySchedule.role,
          image: typeof mySchedule.image === "string" ? mySchedule.image : doc.image,
          strNumber: mySchedule.strNumber
        };
      }
      return doc;
    });
    apiService.saveDoctorsLocal(updated);
    if (mySchedule.id) {
      await apiService.updateDoctor(mySchedule.id, {
        doctor: mySchedule.doctor,
        role: mySchedule.role,
        image: typeof mySchedule.image === "string" ? mySchedule.image : undefined,
        strNumber: mySchedule.strNumber
      });
    }
    setSuccessMsg("Profil & foto praktisi medis berhasil diperbarui!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

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
            <Title
              title="Overview & Ringkasan Pelayanan Klinik"
              desc="Monitoring antrean pasien dan aktivitas pelayanan medis hari ini."
            />
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

          <Table
            title="Pratinjau Antrean Pasien Hari Ini"
            headerAction={
              <Button size="sm" onClick={() => setActiveMenu("antrean")}>Lihat Semua Antrean →</Button>
            }
          >
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
                    <TableBadge status={item.status || "Menunggu Antrean"} />
                  </td>
                  <td>
                    <Table.ActionCell>
                      <Button size="sm" variant="secondary" onClick={() => handleStatusChange(item.id, "Sedang Dilayani")}>Panggil</Button>
                      <Button size="sm" onClick={() => handleStatusChange(item.id, "Selesai")}>Selesai</Button>
                    </Table.ActionCell>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {activeMenu === "antrean" && (
        <>
          <div className={styles.header}>
            <Title
              title="Manajemen Antrean & Catatan Pelayanan Pasien"
              desc="Kelola status kehadiran pasien dan berikan catatan rekam pelayanan medis."
            />
          </div>

          <Table
            title="Daftar Antrean Pasien"
            headerAction={
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
            }
          >
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
                    <TableBadge status={item.status || "Menunggu Antrean"} />
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
                    <Table.ActionCell>
                      <Button size="sm" variant="secondary" onClick={() => handleStatusChange(item.id, "Sedang Dilayani")}>Layani</Button>
                      <Button size="sm" onClick={() => handleStatusChange(item.id, "Selesai")}>Selesai</Button>
                      <Button size="sm" variant="secondary" onClick={() => handleStatusChange(item.id, "Dibatalkan")}>Batal</Button>
                    </Table.ActionCell>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {activeMenu === "jadwal" && (
        <>
          <div className={styles.header}>
            <Title
              title="Jadwal Praktik & Jenis Layanan Medis"
              desc="Kelola dan perbarui jadwal kerja harian serta daftar jenis layanan medis yang aktif ditangani."
            />
          </div>

          <div className={styles.formCard}>
            <h3>Pengaturan Hari & Jam Kerja Bidan</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <InputText label="Hari Mulai Praktik" value={mySchedule.startDay} onChange={(e) => setMySchedule({ ...mySchedule, startDay: e.target.value })} />
              <InputText label="Hari Selesai Praktik" value={mySchedule.endDay} onChange={(e) => setMySchedule({ ...mySchedule, endDay: e.target.value })} />
              <InputText label="Jam Mulai Praktik" value={mySchedule.startTime} onChange={(e) => setMySchedule({ ...mySchedule, startTime: e.target.value })} />
              <InputText label="Jam Selesai Praktik" value={mySchedule.endTime} onChange={(e) => setMySchedule({ ...mySchedule, endTime: e.target.value })} />
            </div>

            <div style={{ marginTop: "20px" }}>
              <h4 style={{ margin: "0 0 12px 0", color: "#1f2937" }}>Layanan Kebidanan & Care yang Ditangani:</h4>

              <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", marginBottom: "12px" }}>
                <div style={{ flex: 1 }}>
                  <InputSelect
                    label="Pilih Jenis Layanan Resmi Klinik (Terdaftar di DB)"
                    options={availableClinicServices.filter((svc) => !mySchedule.services.includes(svc))}
                    value={selectedServiceToSelect}
                    onChange={(val) => setSelectedServiceToSelect(val)}
                    placeholder="-- Pilih Layanan Terdaftar di Database --"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    if (selectedServiceToSelect && !mySchedule.services.includes(selectedServiceToSelect)) {
                      setMySchedule({ ...mySchedule, services: [...mySchedule.services, selectedServiceToSelect] });
                      setSelectedServiceToSelect("");
                    }
                  }}
                >
                  + Tambah Layanan
                </Button>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
                {mySchedule.services.map((s, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "#fbcfe8",
                      color: "#831843",
                      padding: "6px 14px",
                      borderRadius: "9999px",
                      fontSize: "13px",
                      fontWeight: "600",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    {s}
                    <span
                      style={{ cursor: "pointer", fontWeight: "bold", marginLeft: "4px" }}
                      onClick={() => {
                        setMySchedule({
                          ...mySchedule,
                          services: mySchedule.services.filter((_, i) => i !== idx)
                        });
                      }}
                    >
                      ✕
                    </span>
                  </span>
                ))}
              </div>
            </div>

            <Button onClick={handleSaveSchedule}>
              Simpan Perubahan Jadwal & Layanan
            </Button>
          </div>
        </>
      )}

      {activeMenu === "profil" && (
        <>
          <div className={styles.header}>
            <Title
              title="Profil Identitas Bidan / Praktisi Medis"
              desc="Kelola foto profil, data kredensial praktisi, dan Surat Izin Praktik (STR/SIP)."
            />
          </div>

          <div className={styles.formProfilCard}>
            <div className={styles.formProfilContent}>
              <InputImage
                label="Perbarui Foto Profil"
                value={mySchedule.image}
                onChange={(file, previewUrl) => {
                  setMySchedule({ ...mySchedule, image: previewUrl || file });
                }}
                placeholder="Klik atau seret foto baru ke sini untuk mengganti foto profil dokter/bidan"
              />
            </div>
            <div className={styles.formProfilContent}>
              <InputText label="Nama Lengkap & Gelar Bidan" value={mySchedule.doctor} onChange={(e) => setMySchedule({ ...mySchedule, doctor: e.target.value })} />
              <InputText label="Peran / Spesialisasi Medis" value={mySchedule.role} onChange={(e) => setMySchedule({ ...mySchedule, role: e.target.value })} />
              <InputText label="Nomor Surat Tanda Registrasi (STR/SIP)" value={mySchedule.strNumber} onChange={(e) => setMySchedule({ ...mySchedule, strNumber: e.target.value })} />
              <Button onClick={handleSaveProfile}>
                Simpan Profil & Foto Bidan
              </Button>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
