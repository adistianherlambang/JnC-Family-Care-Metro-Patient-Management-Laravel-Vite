import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import initialDummyData from "../../json/UserDashboardDummy.json";
import initialDummyDokter from "../../json/DummyDokter.json";
import initialLayanan from "../../json/Layanan.json";
import { InputText, InputSelect, InputRadio, InputImage } from "../../components/Input";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("antrean");

  const [queueDateFilter, setQueueDateFilter] = useState("Hari Ini");

  const [queues, setQueues] = useState([
    {
      id: "Q-001",
      queueNumber: "A-014",
      patientName: "Siti Nurhaliza",
      doctor: "dr. Aulia Rahma, Sp.A",
      service: "Konsultasi tumbuh kembang anak",
      date: "Hari Ini",
      time: "09:30 WIB",
      status: "Menunggu Antrean"
    },
    {
      id: "Q-002",
      queueNumber: "A-015",
      patientName: "Dewi Lestari",
      doctor: "Bidan Siti Rahmawati, S.Tr.Keb",
      service: "Pemeriksaan Kehamilan",
      date: "Besok",
      time: "10:00 WIB",
      status: "Dipanggil"
    },
    {
      id: "Q-003",
      queueNumber: "A-016",
      patientName: "Rina Wijaya",
      doctor: "Bidan Nabila Putri, S.Keb",
      service: "Prenatal Yoga",
      date: "Hari Ini",
      time: "11:00 WIB",
      status: "Menunggu Antrean"
    }
  ]);

  const [doctors, setDoctors] = useState(initialDummyDokter);
  const [categories, setCategories] = useState(initialLayanan);
  const [news, setNews] = useState(initialDummyData.news);
  const [faqs, setFaqs] = useState(initialDummyData.faqs);

  // Form states
  // 1. Queue Form
  const [newQueue, setNewQueue] = useState({
    patientName: "",
    kategoriLayanan: "",
    service: "",
    doctor: "",
    date: "Hari Ini"
  });

const DAYS_OF_WEEK = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const getDaysRange = (startDay, endDay) => {
  const startIndex = DAYS_OF_WEEK.indexOf(startDay);
  const endIndex = DAYS_OF_WEEK.indexOf(endDay);
  if (startIndex === -1 || endIndex === -1) return [startDay || "Senin"];
  if (startIndex <= endIndex) {
    return DAYS_OF_WEEK.slice(startIndex, endIndex + 1);
  } else {
    return [...DAYS_OF_WEEK.slice(startIndex), ...DAYS_OF_WEEK.slice(0, endIndex + 1)];
  }
};

  // 2. Doctor Form
  const [newDoctor, setNewDoctor] = useState({
    doctor: "",
    role: "",
    image: "",
    startDay: "Senin",
    endDay: "Jumat",
    startTime: "08:00",
    endTime: "14:00",
    selectedServiceInput: "",
    servicesList: []
  });

  // 3. Schedule Form
  const [newSchedule, setNewSchedule] = useState({
    doctor: "",
    days: "Senin",
    startTime: "08:00",
    endTime: "12:00",
    services: ""
  });

  // 4. Poli / Category Form
  const [newCategory, setNewCategory] = useState({
    title: "",
    tempServiceName: "",
    servicesList: []
  });

  // 5. News Form
  const [newNews, setNewNews] = useState({
    title: "",
    category: "Kesehatan Anak",
    summary: ""
  });

  // 6. FAQ Form
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: ""
  });

  // Handlers CRUD
  // Queue Handlers
  const [editingQueueId, setEditingQueueId] = useState(null);

  const handleStartEditQueue = (q) => {
    setEditingQueueId(q.id);
    setNewQueue({
      patientName: q.patientName,
      kategoriLayanan: "",
      service: q.service,
      doctor: q.doctor,
      date: q.date
    });
  };

  const handleCancelEditQueue = () => {
    setEditingQueueId(null);
    setNewQueue({ patientName: "", kategoriLayanan: "", service: "", doctor: "", date: "Hari Ini" });
  };

  const handleAddQueue = () => {
    if (!newQueue.patientName.trim() || !newQueue.doctor || !newQueue.service) return;

    if (editingQueueId) {
      setQueues(
        queues.map((q) =>
          q.id === editingQueueId
            ? {
                ...q,
                patientName: newQueue.patientName.trim(),
                doctor: newQueue.doctor,
                service: newQueue.service,
                date: newQueue.date
              }
            : q
        )
      );
      setEditingQueueId(null);
    } else {
      const item = {
        id: `Q-00${queues.length + 1}`,
        queueNumber: `A-0${Math.floor(Math.random() * 80) + 20}`,
        patientName: newQueue.patientName,
        doctor: newQueue.doctor,
        service: newQueue.service,
        date: newQueue.date,
        time: "09:00 WIB",
        status: "Menunggu Antrean"
      };
      setQueues([...queues, item]);
    }
    setNewQueue({ patientName: "", kategoriLayanan: "", service: "", doctor: "", date: "Hari Ini" });
  };

  const handleUpdateQueueStatus = (id, newStatus) => {
    setQueues(
      queues.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
    );
  };

  const handleDeleteQueue = (id) => {
    setQueues(queues.filter((q) => q.id !== id));
  };

  // Doctor Handlers
  const [editingDoctorName, setEditingDoctorName] = useState(null);

  const handleStartEditDoctor = (doc) => {
    setEditingDoctorName(doc.doctor);
    const firstSchedule = doc.schedules?.[0] || {};
    const days = firstSchedule.days || ["Senin", "Jumat"];
    const servicesList = Array.from(new Set(doc.schedules.flatMap((s) => s.services)));

    setNewDoctor({
      doctor: doc.doctor,
      role: doc.role || "",
      image: doc.image || "",
      startDay: doc.startDay || days[0] || "Senin",
      endDay: doc.endDay || days[days.length - 1] || "Jumat",
      startTime: doc.startTime || firstSchedule.startTime || "08:00",
      endTime: doc.endTime || firstSchedule.endTime || "14:00",
      selectedServiceInput: "",
      servicesList: servicesList
    });
  };

  const handleCancelEditDoctor = () => {
    setEditingDoctorName(null);
    setNewDoctor({
      doctor: "",
      role: "",
      image: "",
      startDay: "Senin",
      endDay: "Jumat",
      startTime: "08:00",
      endTime: "14:00",
      selectedServiceInput: "",
      servicesList: []
    });
  };

  const handleAddDoctor = () => {
    if (!newDoctor.doctor.trim()) return;

    const startDay = newDoctor.startDay || "Senin";
    const endDay = newDoctor.endDay || "Jumat";
    const startTime = newDoctor.startTime || "08:00";
    const endTime = newDoctor.endTime || "14:00";
    const daysList = getDaysRange(startDay, endDay);
    const displayDays = startDay === endDay ? startDay : `${startDay} - ${endDay}`;

    const servicesList = newDoctor.servicesList.length > 0
      ? newDoctor.servicesList
      : ["Konsultasi Umum"];

    if (editingDoctorName) {
      setDoctors(
        doctors.map((d) =>
          d.doctor === editingDoctorName
            ? {
                ...d,
                doctor: newDoctor.doctor.trim(),
                role: newDoctor.role.trim() || "Praktisi Medis",
                image: newDoctor.image || "/img/landingPage/dummyDr.png",
                startDay: startDay,
                endDay: endDay,
                startTime: startTime,
                endTime: endTime,
                schedules: [
                  {
                    days: daysList,
                    displayDays: displayDays,
                    startTime: startTime,
                    endTime: endTime,
                    services: servicesList
                  }
                ]
              }
            : d
        )
      );
      setEditingDoctorName(null);
    } else {
      const docItem = {
        doctor: newDoctor.doctor.trim(),
        role: newDoctor.role.trim() || "Praktisi Medis",
        image: newDoctor.image || "/img/landingPage/dummyDr.png",
        startDay: startDay,
        endDay: endDay,
        startTime: startTime,
        endTime: endTime,
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
      setDoctors([...doctors, docItem]);
    }
    setNewDoctor({
      doctor: "",
      role: "",
      image: "",
      startDay: "Senin",
      endDay: "Jumat",
      startTime: "08:00",
      endTime: "14:00",
      selectedServiceInput: "",
      servicesList: []
    });
  };

  const handleDeleteDoctor = (docName) => {
    setDoctors(doctors.filter((d) => d.doctor !== docName));
  };

  // Schedule Handlers
  const handleAddSchedule = () => {
    if (!newSchedule.doctor) return;
    setDoctors(
      doctors.map((d) => {
        if (d.doctor === newSchedule.doctor) {
          const servicesList = newSchedule.services
            ? newSchedule.services.split(",").map((s) => s.trim())
            : ["Pemeriksaan Medis"];
          return {
            ...d,
            schedules: [
              ...d.schedules,
              {
                days: [newSchedule.days],
                startTime: newSchedule.startTime,
                endTime: newSchedule.endTime,
                services: servicesList
              }
            ]
          };
        }
        return d;
      })
    );
    setNewSchedule({ doctor: "", days: "Senin", startTime: "08:00", endTime: "12:00", services: "" });
  };

  // Category Handlers
  const [editingCategoryTitle, setEditingCategoryTitle] = useState(null);

  const handleStartEditCategory = (cat) => {
    setEditingCategoryTitle(cat.title);
    setNewCategory({
      title: cat.title,
      tempServiceName: "",
      servicesList: [...cat.list]
    });
  };

  const handleCancelEditCategory = () => {
    setEditingCategoryTitle(null);
    setNewCategory({ title: "", tempServiceName: "", servicesList: [] });
  };

  const handleAddCategory = () => {
    if (!newCategory.title.trim()) return;

    if (editingCategoryTitle) {
      setCategories(
        categories.map((c) =>
          c.title === editingCategoryTitle
            ? { title: newCategory.title.trim(), list: newCategory.servicesList }
            : c
        )
      );
      setEditingCategoryTitle(null);
    } else {
      const existingIndex = categories.findIndex((c) => c.title.toLowerCase() === newCategory.title.toLowerCase());
      if (existingIndex >= 0) {
        const updated = [...categories];
        newCategory.servicesList.forEach((item) => {
          if (!updated[existingIndex].list.some((existing) => existing.toLowerCase() === item.toLowerCase())) {
            updated[existingIndex].list.push(item);
          }
        });
        setCategories(updated);
      } else {
        setCategories([
          ...categories,
          {
            title: newCategory.title.trim(),
            list: newCategory.servicesList
          }
        ]);
      }
    }
    setNewCategory({ title: "", tempServiceName: "", servicesList: [] });
  };

  const handleDeleteCategory = (title) => {
    setCategories(categories.filter((c) => c.title !== title));
  };

  // News Handlers
  const [editingNewsId, setEditingNewsId] = useState(null);

  const handleStartEditNews = (n) => {
    setEditingNewsId(n.id);
    setNewNews({
      title: n.title,
      category: n.category,
      summary: n.summary
    });
  };

  const handleCancelEditNews = () => {
    setEditingNewsId(null);
    setNewNews({ title: "", category: "Kesehatan Anak", summary: "" });
  };

  const handleAddNews = () => {
    if (!newNews.title.trim() || !newNews.summary.trim()) return;

    if (editingNewsId) {
      setNews(
        news.map((n) =>
          n.id === editingNewsId
            ? {
                ...n,
                title: newNews.title.trim(),
                category: newNews.category,
                summary: newNews.summary.trim()
              }
            : n
        )
      );
      setEditingNewsId(null);
    } else {
      const now = new Date();
      const item = {
        id: news.length + 1,
        title: newNews.title.trim(),
        category: newNews.category,
        date: `${now.getDate()} Agustus 2026`,
        summary: newNews.summary.trim()
      };
      setNews([item, ...news]);
    }
    setNewNews({ title: "", category: "Kesehatan Anak", summary: "" });
  };

  const handleDeleteNews = (id) => {
    setNews(news.filter((n) => n.id !== id));
  };

  // FAQ Handlers
  const [editingFaqId, setEditingFaqId] = useState(null);

  const handleStartEditFaq = (f) => {
    setEditingFaqId(f.id);
    setNewFaq({
      question: f.question,
      answer: f.answer
    });
  };

  const handleCancelEditFaq = () => {
    setEditingFaqId(null);
    setNewFaq({ question: "", answer: "" });
  };

  const handleAddFaq = () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;

    if (editingFaqId) {
      setFaqs(
        faqs.map((f) =>
          f.id === editingFaqId
            ? {
                ...f,
                question: newFaq.question.trim(),
                answer: newFaq.answer.trim()
              }
            : f
        )
      );
      setEditingFaqId(null);
    } else {
      const item = {
        id: faqs.length + 1,
        question: newFaq.question.trim(),
        answer: newFaq.answer.trim()
      };
      setFaqs([...faqs, item]);
    }
    setNewFaq({ question: "", answer: "" });
  };

  const handleDeleteFaq = (id) => {
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  const filteredQueues = queues.filter((q) => {
    if (queueDateFilter === "Semua") return true;
    return q.date === queueDateFilter;
  });

  const adminCategoryObj = categories.find((c) => c.title === newQueue.kategoriLayanan);
  const adminServiceOptions = adminCategoryObj?.list || [];

  const allClinicServices = Array.from(new Set(categories.flatMap((c) => c.list)));

  const availableWalkinDoctors = doctors.filter((d) =>
    d.schedules.some((s) => !newQueue.service || s.services.includes(newQueue.service))
  );
  const doctorOptions = availableWalkinDoctors.map((d) => d.doctor);

  return (
    <div className={styles.container}>
      {/* Navbar Logo & Admin Info */}
      <div className={styles.nav}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Logo" />
        </div>
        <div className={styles.confirm}>
          <p className={styles.label}>Administrator Klinik</p>
          <p className={styles.value}>Panel Kelola Operasional & Pelayanan</p>
        </div>
      </div>

      {/* Main Container */}
      <div className={styles.thirdContainer}>
        {/* Sidebar Menu */}
        <div className={styles.menuWrapper}>
          <div
            className={`${styles.menuItem} ${activeMenu === "antrean" ? styles.menuItemActive : ""}`}
            onClick={() => setActiveMenu("antrean")}
          >
            Kelola Antrean
          </div>
          <div
            className={`${styles.menuItem} ${activeMenu === "dokter" ? styles.menuItemActive : ""}`}
            onClick={() => setActiveMenu("dokter")}
          >
            Kelola Dokter & Jadwal
          </div>
          <div
            className={`${styles.menuItem} ${activeMenu === "poli" ? styles.menuItemActive : ""}`}
            onClick={() => setActiveMenu("poli")}
          >
            Poli & Layanan
          </div>
          <div
            className={`${styles.menuItem} ${activeMenu === "artikel" ? styles.menuItemActive : ""}`}
            onClick={() => setActiveMenu("artikel")}
          >
            Kelola Artikel
          </div>
          <div
            className={`${styles.menuItem} ${activeMenu === "faq" ? styles.menuItemActive : ""}`}
            onClick={() => setActiveMenu("faq")}
          >
            Kelola FAQ
          </div>
          <div
            className={styles.menuItem}
            onClick={() => {
              localStorage.removeItem("loggedInUser");
              navigate("/login");
            }}
          >
            Keluar
          </div>
        </div>

        {/* Right Content Area */}
        <div className={styles.rightWrapper}>
          {/* 1. CRUD Antrean Pasien */}
          {activeMenu === "antrean" && (
            <>
              <div className={styles.header}>
                <p className={styles.title}>Kelola Antrean Pasien</p>
                <p className={styles.desc}>Pantau dan perbarui status antrean pasien secara realtime.</p>
              </div>

              {/* Form Tambah Antrean Walk-in */}
              <div className={styles.inputContainer}>
                <p className={styles.title}>Pendaftaran Antrean Pasien Walk-In</p>
                <div className={styles.inputWrapper}>
                  <InputText
                    label="Nama Pasien"
                    value={newQueue.patientName}
                    onChange={(e) => setNewQueue({ ...newQueue, patientName: e.target.value })}
                    placeholder="Masukkan nama lengkap pasien"
                  />
                  <InputSelect
                    label="Tanggal Layanan"
                    options={["Hari Ini", "Besok"]}
                    value={newQueue.date}
                    onChange={(val) => setNewQueue({ ...newQueue, date: val, doctor: "", service: "" })}
                    placeholder="Pilih Tanggal Layanan"
                  />
                  <InputRadio
                    label="Kategori Layanan"
                    options={categories.map((item) => item.title)}
                    value={newQueue.kategoriLayanan}
                    onChange={(val) => setNewQueue({ ...newQueue, kategoriLayanan: val, service: "", doctor: "" })}
                  />
                  <InputSelect
                    label="Pilih Layanan"
                    options={adminServiceOptions}
                    value={newQueue.service}
                    onChange={(val) => setNewQueue({ ...newQueue, service: val, doctor: "" })}
                    placeholder="Pilih Layanan"
                  />
                  <InputSelect
                    label="Pilih Dokter / Bidan"
                    options={doctorOptions}
                    value={newQueue.doctor}
                    onChange={(val) => setNewQueue({ ...newQueue, doctor: val })}
                    placeholder="Pilih Dokter / Bidan"
                  />
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div className={styles.button} onClick={handleAddQueue}>
                    {editingQueueId ? "Simpan Perubahan Antrean" : "Terbitkan Antrean"}
                  </div>
                  {editingQueueId && (
                    <div className={`${styles.button} ${styles.buttonSecondary}`} onClick={handleCancelEditQueue}>
                      Batal
                    </div>
                  )}
                </div>
              </div>

              {/* Filter Tanggal Antrean */}
              <div className={styles.inputContainer}>
                <p className={styles.title}>Filter Antrean Berdasarkan Tanggal</p>
                <div className={styles.inputWrapper}>
                  <InputSelect
                    label="Pilih Filter Tanggal"
                    options={["Hari Ini", "Besok", "Semua"]}
                    value={queueDateFilter}
                    onChange={(val) => setQueueDateFilter(val)}
                    placeholder="Filter Tanggal"
                  />
                </div>
              </div>

              {/* Daftar Antrean (Tabel Pendaftaran Pasien) */}
              <div className={styles.inputContainer}>
                <p className={styles.title}>Daftar Antrean Aktif - {queueDateFilter} ({filteredQueues.length})</p>
                {filteredQueues.length > 0 ? (
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>No. Antrean</th>
                          <th>Nama Pasien</th>
                          <th>Dokter / Bidan</th>
                          <th>Layanan</th>
                          <th>Tanggal & Waktu</th>
                          <th>Status</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredQueues.map((q) => (
                          <tr key={q.id} className={styles.tableTr}>
                            <td style={{ fontWeight: "600", color: "var(--primary)" }}>{q.queueNumber}</td>
                            <td style={{ fontWeight: "500" }}>{q.patientName}</td>
                            <td>{q.doctor}</td>
                            <td>{q.service}</td>
                            <td>{q.date} • {q.time}</td>
                            <td>
                              <span className={`${styles.statusText} ${q.status === "Dipanggil" ? styles.statusActive : q.status === "Selesai" ? styles.statusDone : styles.statusPending}`}>
                                {q.status}
                              </span>
                            </td>
                            <td>
                              <div className={styles.actionCell}>
                                <button
                                  type="button"
                                  className={`${styles.button} ${styles.actionBtn}`}
                                  onClick={() => handleUpdateQueueStatus(q.id, "Dipanggil")}
                                >
                                  Panggil
                                </button>
                                <button
                                  type="button"
                                  className={`${styles.button} ${styles.buttonSecondary} ${styles.actionBtn}`}
                                  onClick={() => handleStartEditQueue(q)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className={`${styles.button} ${styles.buttonSecondary} ${styles.actionBtn}`}
                                  onClick={() => handleUpdateQueueStatus(q.id, "Selesai")}
                                >
                                  Selesai
                                </button>
                                <button
                                  type="button"
                                  className={`${styles.button} ${styles.buttonDanger} ${styles.actionBtn}`}
                                  onClick={() => handleDeleteQueue(q.id)}
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className={styles.desc}>Tidak ada antrean aktif pada tanggal terpilih ({queueDateFilter}).</p>
                )}
              </div>
            </>
          )}

          {/* 2. CRUD Dokter & Jadwal */}
          {activeMenu === "dokter" && (
            <>
              <div className={styles.header}>
                <p className={styles.title}>Kelola Data & Jadwal Praktik Dokter</p>
                <p className={styles.desc}>Tambah, edit, dan kelola profil dokter, foto, serta jadwal jam kerja praktik.</p>
              </div>

              {/* Form Tambah / Edit Dokter */}
              <div className={styles.inputContainer}>
                <p className={styles.title}>{editingDoctorName ? "Edit Data Dokter & Jadwal" : "Tambah Dokter Baru"}</p>
                <div className={styles.inputWrapper}>
                  <InputText
                    label="Nama Dokter & Gelar"
                    value={newDoctor.doctor}
                    onChange={(e) => setNewDoctor({ ...newDoctor, doctor: e.target.value })}
                    placeholder="Contoh: dr. Fitri Handayani, Sp.A"
                  />
                  <InputText
                    label="Peran / Spesialisasi"
                    value={newDoctor.role}
                    onChange={(e) => setNewDoctor({ ...newDoctor, role: e.target.value })}
                    placeholder="Contoh: Spesialis Kandungan & Kebidanan"
                  />
                  <InputImage
                    label="Foto Dokter (Opsional)"
                    value={newDoctor.image}
                    onChange={(file, preview) => setNewDoctor({ ...newDoctor, image: preview })}
                    placeholder="Unggah foto profil dokter untuk ditampilkan di Landing Page"
                  />

                  {/* Pengaturan Hari & Jam Kerja */}
                  <div className={styles.input}>
                    <InputSelect
                      label="Hari Praktik Mulai"
                      options={DAYS_OF_WEEK}
                      value={newDoctor.startDay}
                      onChange={(val) => setNewDoctor({ ...newDoctor, startDay: val })}
                      placeholder="Hari Mulai"
                    />
                    <InputSelect
                      label="Hari Praktik Selesai"
                      options={DAYS_OF_WEEK}
                      value={newDoctor.endDay}
                      onChange={(val) => setNewDoctor({ ...newDoctor, endDay: val })}
                      placeholder="Hari Selesai"
                    />
                  </div>

                  <div className={styles.input}>
                    <InputText
                      label="Jam Mulai Praktik"
                      value={newDoctor.startTime}
                      onChange={(e) => setNewDoctor({ ...newDoctor, startTime: e.target.value })}
                      placeholder="08:00"
                    />
                    <InputText
                      label="Jam Selesai Praktik"
                      value={newDoctor.endTime}
                      onChange={(e) => setNewDoctor({ ...newDoctor, endTime: e.target.value })}
                      placeholder="14:00"
                    />
                  </div>

                  <div className={styles.addInputRow}>
                    <div style={{ flex: 1 }}>
                      <InputSelect
                        label="Daftar Layanan Medis yang Diberikan"
                        options={allClinicServices.filter((s) => !newDoctor.servicesList.some((existing) => existing.toLowerCase() === s.toLowerCase()))}
                        value={newDoctor.selectedServiceInput || ""}
                        onChange={(val) => setNewDoctor({ ...newDoctor, selectedServiceInput: val })}
                        placeholder="Pilih Layanan dari Daftar Resmi Klinik"
                      />
                    </div>
                    <button
                      type="button"
                      className={`${styles.button} ${styles.actionBtn}`}
                      style={{ height: "48px" }}
                      onClick={() => {
                        const val = newDoctor.selectedServiceInput?.trim();
                        if (val && !newDoctor.servicesList.some((s) => s.toLowerCase() === val.toLowerCase())) {
                          setNewDoctor({
                            ...newDoctor,
                            servicesList: [...newDoctor.servicesList, val],
                            selectedServiceInput: ""
                          });
                        }
                      }}
                    >
                      + Tambah Layanan
                    </button>
                  </div>

                  {newDoctor.servicesList.length > 0 && (
                    <div className={styles.chipContainer}>
                      {newDoctor.servicesList.map((svc, i) => (
                        <span key={i} className={styles.chip}>
                          {svc}
                          <span
                            className={styles.chipRemove}
                            onClick={() =>
                              setNewDoctor({
                                ...newDoctor,
                                servicesList: newDoctor.servicesList.filter((_, idx) => idx !== i)
                              })
                            }
                          >
                            ✕
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div className={styles.button} onClick={handleAddDoctor}>
                    {editingDoctorName ? "Simpan Perubahan Dokter" : "Simpan Dokter Baru"}
                  </div>
                  {editingDoctorName && (
                    <div className={`${styles.button} ${styles.buttonSecondary}`} onClick={handleCancelEditDoctor}>
                      Batal
                    </div>
                  )}
                </div>
              </div>

              {/* Daftar Dokter */}
              <div className={styles.inputContainer}>
                <p className={styles.title}>Daftar Dokter Terdaftar ({doctors.length})</p>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Foto</th>
                        <th>Nama Dokter & Gelar</th>
                        <th>Peran / Spesialisasi</th>
                        <th>Jadwal Praktik</th>
                        <th>Layanan Utama</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((doc, idx) => (
                        <tr key={idx} className={styles.tableTr}>
                          <td>
                            <img
                              src={doc.image || "/img/landingPage/dummyDr.png"}
                              alt={doc.doctor}
                              style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(216, 150, 237, 0.4)" }}
                            />
                          </td>
                          <td style={{ fontWeight: "600", color: "#1F2937" }}>{doc.doctor}</td>
                          <td style={{ color: "#6b7280" }}>{doc.role || "Praktisi Medis"}</td>
                          <td>
                            {doc.schedules.map((s, i) => (
                              <div key={i} style={{ fontSize: "13px", fontWeight: "500", color: "var(--primary)" }}>
                                {s.displayDays || (s.days.length > 1 ? `${s.days[0]} - ${s.days[s.days.length - 1]}` : s.days[0])} ({s.startTime} - {s.endTime})
                              </div>
                            ))}
                          </td>
                          <td style={{ fontSize: "13px" }}>
                            {doc.schedules.flatMap((s) => s.services).slice(0, 3).join(", ")}
                          </td>
                          <td>
                            <div className={styles.actionCell}>
                              <button
                                type="button"
                                className={`${styles.button} ${styles.buttonSecondary} ${styles.actionBtn}`}
                                onClick={() => handleStartEditDoctor(doc)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className={`${styles.button} ${styles.buttonDanger} ${styles.actionBtn}`}
                                onClick={() => handleDeleteDoctor(doc.doctor)}
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* 3. CRUD Jadwal Dokter */}
          {activeMenu === "jadwal" && (
            <>
              <div className={styles.header}>
                <p className={styles.title}>Kelola Jadwal Praktik Dokter</p>
                <p className={styles.desc}>Atur hari dan jam praktik kerja dokter serta bidan.</p>
              </div>

              <div className={styles.inputContainer}>
                <p className={styles.title}>Tambah Jadwal Praktik</p>
                <div className={styles.inputWrapper}>
                  <InputSelect
                    label="Pilih Dokter"
                    options={doctorOptions}
                    value={newSchedule.doctor}
                    onChange={(val) => setNewSchedule({ ...newSchedule, doctor: val })}
                    placeholder="Pilih Dokter"
                  />
                  <InputSelect
                    label="Hari Praktik"
                    options={["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]}
                    value={newSchedule.days}
                    onChange={(val) => setNewSchedule({ ...newSchedule, days: val })}
                    placeholder="Pilih Hari"
                  />
                  <div className={styles.input}>
                    <InputText
                      label="Jam Mulai"
                      value={newSchedule.startTime}
                      onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                      placeholder="08:00"
                    />
                    <InputText
                      label="Jam Selesai"
                      value={newSchedule.endTime}
                      onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                      placeholder="14:00"
                    />
                  </div>
                  <InputText
                    label="Layanan Spesifik (Pisahkan dengan koma)"
                    value={newSchedule.services}
                    onChange={(e) => setNewSchedule({ ...newSchedule, services: e.target.value })}
                    placeholder="Pemeriksaan Umum, Imunisasi"
                  />
                </div>
                <div className={styles.button} onClick={handleAddSchedule}>
                  Tambah Jadwal
                </div>
              </div>
            </>
          )}

          {/* 4. CRUD Poli & Kategori Layanan */}
          {activeMenu === "poli" && (
            <>
              <div className={styles.header}>
                <p className={styles.title}>Kelola Poli & Kategori Layanan</p>
                <p className={styles.desc}>Tambah dan kelola jenis kategori pelayanan resmi klinik.</p>
              </div>

              <div className={styles.inputContainer}>
                <p className={styles.title}>Tambah Kategori / Layanan Baru</p>
                <div className={styles.inputWrapper}>
                  <InputText
                    label="Nama Kategori (Poli / Mom's Treatment / dll)"
                    value={newCategory.title}
                    onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
                    placeholder="Contoh: Poli Kebidanan"
                  />
                  <div className={styles.addInputRow}>
                    <div style={{ flex: 1 }}>
                      <InputText
                        label="Nama Layanan Spesifik"
                        value={newCategory.tempServiceName || ""}
                        onChange={(e) => setNewCategory({ ...newCategory, tempServiceName: e.target.value })}
                        placeholder="Contoh: Pemeriksaan USG 4D"
                      />
                    </div>
                    <button
                      type="button"
                      className={`${styles.button} ${styles.actionBtn}`}
                      style={{ height: "48px" }}
                      onClick={() => {
                        const val = newCategory.tempServiceName?.trim();
                        if (val && !newCategory.servicesList.some((s) => s.toLowerCase() === val.toLowerCase())) {
                          setNewCategory({
                            ...newCategory,
                            servicesList: [...newCategory.servicesList, val],
                            tempServiceName: ""
                          });
                        }
                      }}
                    >
                      + Tambah Layanan
                    </button>
                  </div>

                  {newCategory.servicesList.length > 0 && (
                    <div className={styles.chipContainer}>
                      {newCategory.servicesList.map((svc, i) => (
                        <span key={i} className={styles.chip}>
                          {svc}
                          <span
                            className={styles.chipRemove}
                            onClick={() =>
                              setNewCategory({
                                ...newCategory,
                                servicesList: newCategory.servicesList.filter((_, idx) => idx !== i)
                              })
                            }
                          >
                            ✕
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div className={styles.button} onClick={handleAddCategory}>
                    {editingCategoryTitle ? "Simpan Perubahan Kategori" : "Simpan Kategori / Layanan"}
                  </div>
                  {editingCategoryTitle && (
                    <div className={`${styles.button} ${styles.buttonSecondary}`} onClick={handleCancelEditCategory}>
                      Batal
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.inputContainer}>
                <p className={styles.title}>Daftar Kategori Layanan ({categories.length})</p>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Nama Kategori</th>
                        <th>Jumlah Layanan</th>
                        <th>Daftar Layanan Spesifik</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((cat, idx) => (
                        <tr key={idx} className={styles.tableTr}>
                          <td style={{ fontWeight: "600", color: "#6b7280" }}>{idx + 1}</td>
                          <td style={{ fontWeight: "600", color: "var(--primary)" }}>{cat.title}</td>
                          <td>{cat.list.length} Layanan</td>
                          <td style={{ fontSize: "13px" }}>
                            {cat.list.length > 0 ? cat.list.join(", ") : "-"}
                          </td>
                          <td>
                            <div className={styles.actionCell}>
                              <button
                                type="button"
                                className={`${styles.button} ${styles.buttonSecondary} ${styles.actionBtn}`}
                                onClick={() => handleStartEditCategory(cat)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className={`${styles.button} ${styles.buttonDanger} ${styles.actionBtn}`}
                                onClick={() => handleDeleteCategory(cat.title)}
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* 5. CRUD Artikel & Berita */}
          {activeMenu === "artikel" && (
            <>
              <div className={styles.header}>
                <p className={styles.title}>Kelola Artikel & Berita Kesehatan</p>
                <p className={styles.desc}>Publikasikan artikel edukasi kesehatan ibu dan anak.</p>
              </div>

              <div className={styles.inputContainer}>
                <p className={styles.title}>Tambah Artikel Baru</p>
                <div className={styles.inputWrapper}>
                  <InputText
                    label="Judul Artikel"
                    value={newNews.title}
                    onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                    placeholder="Masukkan judul artikel"
                  />
                  <InputSelect
                    label="Kategori Artikel"
                    options={["Kesehatan Anak", "Kehamilan & Persalinan", "Mom & Baby Care"]}
                    value={newNews.category}
                    onChange={(val) => setNewNews({ ...newNews, category: val })}
                    placeholder="Pilih Kategori"
                  />
                  <InputText
                    label="Ringkasan Artikel"
                    value={newNews.summary}
                    onChange={(e) => setNewNews({ ...newNews, summary: e.target.value })}
                    placeholder="Masukkan ringkasan singkat artikel"
                  />
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div className={styles.button} onClick={handleAddNews}>
                    {editingNewsId ? "Simpan Perubahan Artikel" : "Publikasikan Artikel"}
                  </div>
                  {editingNewsId && (
                    <div className={`${styles.button} ${styles.buttonSecondary}`} onClick={handleCancelEditNews}>
                      Batal
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.inputContainer}>
                <p className={styles.title}>Daftar Artikel Terbit ({news.length})</p>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Judul Artikel</th>
                        <th>Kategori</th>
                        <th>Tanggal Terbit</th>
                        <th>Ringkasan</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {news.map((n, idx) => (
                        <tr key={n.id} className={styles.tableTr}>
                          <td style={{ fontWeight: "600", color: "#6b7280" }}>{idx + 1}</td>
                          <td style={{ fontWeight: "600", color: "var(--primary)" }}>{n.title}</td>
                          <td>
                            <span className={styles.statusText} style={{ backgroundColor: "#FAF0FC", color: "var(--primary)" }}>
                              {n.category}
                            </span>
                          </td>
                          <td style={{ fontSize: "13px" }}>{n.date}</td>
                          <td style={{ fontSize: "13px", color: "#4b5563", maxWidth: "280px" }}>{n.summary}</td>
                          <td>
                            <div className={styles.actionCell}>
                              <button
                                type="button"
                                className={`${styles.button} ${styles.buttonSecondary} ${styles.actionBtn}`}
                                onClick={() => handleStartEditNews(n)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className={`${styles.button} ${styles.buttonDanger} ${styles.actionBtn}`}
                                onClick={() => handleDeleteNews(n.id)}
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* 6. CRUD FAQ */}
          {activeMenu === "faq" && (
            <>
              <div className={styles.header}>
                <p className={styles.title}>Kelola FAQ (Pertanyaan Umum)</p>
                <p className={styles.desc}>Atur pertanyaan dan jawaban pusat bantuan pasien.</p>
              </div>

              <div className={styles.inputContainer}>
                <p className={styles.title}>Tambah Pertanyaan FAQ Baru</p>
                <div className={styles.inputWrapper}>
                  <InputText
                    label="Pertanyaan"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    placeholder="Masukkan pertanyaan"
                  />
                  <InputText
                    label="Jawaban"
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                    placeholder="Masukkan jawaban"
                  />
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div className={styles.button} onClick={handleAddFaq}>
                    {editingFaqId ? "Simpan Perubahan FAQ" : "Simpan Pertanyaan FAQ"}
                  </div>
                  {editingFaqId && (
                    <div className={`${styles.button} ${styles.buttonSecondary}`} onClick={handleCancelEditFaq}>
                      Batal
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.inputContainer}>
                <p className={styles.title}>Daftar Pertanyaan FAQ ({faqs.length})</p>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Pertanyaan</th>
                        <th>Jawaban</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faqs.map((f, idx) => (
                        <tr key={f.id} className={styles.tableTr}>
                          <td style={{ fontWeight: "600", color: "#6b7280" }}>{idx + 1}</td>
                          <td style={{ fontWeight: "600", color: "var(--primary)", maxWidth: "260px" }}>{f.question}</td>
                          <td style={{ fontSize: "13px", color: "#4b5563", maxWidth: "350px" }}>{f.answer}</td>
                          <td>
                            <div className={styles.actionCell}>
                              <button
                                type="button"
                                className={`${styles.button} ${styles.buttonSecondary} ${styles.actionBtn}`}
                                onClick={() => handleStartEditFaq(f)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className={`${styles.button} ${styles.buttonDanger} ${styles.actionBtn}`}
                                onClick={() => handleDeleteFaq(f.id)}
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
