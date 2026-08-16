import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import InputText from "../../components/Input/InputText";
import InputSelect from "../../components/Input/InputSelect";
import InputRadio from "../../components/Input/InputRadio";
import InputImage from "../../components/Input/InputImage";
import Button from "../../components/Button/Button";
import { apiService } from "../../services/apiService";
import BlogEditorModal from "../../components/BlogEditor/BlogEditorModal";
import BlogReaderModal from "../../components/BlogEditor/BlogReaderModal";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";

const DAYS_OF_WEEK = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const getDaysRange = (startDay, endDay) => {
  const startIndex = DAYS_OF_WEEK.indexOf(startDay);
  const endIndex = DAYS_OF_WEEK.indexOf(endDay);
  if (startIndex === -1 || endIndex === -1) return [startDay, endDay];
  if (startIndex <= endIndex) {
    return DAYS_OF_WEEK.slice(startIndex, endIndex + 1);
  } else {
    return [...DAYS_OF_WEEK.slice(startIndex), ...DAYS_OF_WEEK.slice(0, endIndex + 1)];
  }
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("overview"); // 'overview', 'antrean', 'dokter', 'poli', 'artikel', 'faq'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Master Data State
  const [queues, setQueues] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [news, setNews] = useState([]);
  const [faqs, setFaqs] = useState([]);

  // Blog Editor & Reader States
  const [isBlogEditorOpen, setIsBlogEditorOpen] = useState(false);
  const [selectedArticleForEdit, setSelectedArticleForEdit] = useState(null);
  const [selectedArticleForPreview, setSelectedArticleForPreview] = useState(null);

  const isDataLoaded = useRef(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      navigate("/login", { replace: true });
      return;
    }
    const isUserAdmin = loggedInUser.toLowerCase() === "admin" || loggedInUser.toLowerCase() === "administrator";
    if (!isUserAdmin) {
      navigate("/dashboard", { replace: true });
      return;
    }

    async function loadData() {
      const cats = await apiService.getCategories();
      setCategories(cats);
      const docs = await apiService.getDoctors();
      setDoctors(docs);
      const qList = await apiService.getQueues();
      setQueues(qList);
      const nList = await apiService.getNews();
      setNews(nList);
      const fList = await apiService.getFaqs();
      setFaqs(fList);
      isDataLoaded.current = true;
    }
    loadData();
  }, [navigate]);

  useEffect(() => {
    if (isDataLoaded.current) apiService.saveNewsLocal(news);
  }, [news]);

  useEffect(() => {
    if (isDataLoaded.current) apiService.saveFaqsLocal(faqs);
  }, [faqs]);

  useEffect(() => {
    if (isDataLoaded.current) apiService.saveDoctorsLocal(doctors);
  }, [doctors]);

  useEffect(() => {
    if (isDataLoaded.current) apiService.saveCategoriesLocal(categories);
  }, [categories]);

  useEffect(() => {
    if (isDataLoaded.current) apiService.saveQueuesLocal(queues);
  }, [queues]);

  // Filter State
  const [queueDateFilter, setQueueDateFilter] = useState("Hari Ini");

  // Forms State
  const [newQueue, setNewQueue] = useState({
    patientName: "",
    kategoriLayanan: "",
    service: "",
    doctor: "",
    date: "Hari Ini"
  });

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

  const [newCategory, setNewCategory] = useState({
    title: "",
    tempServiceName: "",
    servicesList: []
  });

  const [newNews, setNewNews] = useState({
    title: "",
    category: "Kesehatan Anak",
    summary: ""
  });

  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: ""
  });

  // Edit States
  const [editingQueueId, setEditingQueueId] = useState(null);
  const [editingDoctorName, setEditingDoctorName] = useState(null);
  const [editingCategoryTitle, setEditingCategoryTitle] = useState(null);
  const [editingNewsId, setEditingNewsId] = useState(null);
  const [editingFaqId, setEditingFaqId] = useState(null);

  // Handlers Open Add Modals
  const handleOpenAddQueueModal = () => {
    setEditingQueueId(null);
    setNewQueue({ patientName: "", kategoriLayanan: "", service: "", doctor: "", date: "Hari Ini" });
    setIsModalOpen(true);
  };

  const handleOpenAddDoctorModal = () => {
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
    setIsModalOpen(true);
  };

  const handleOpenAddCategoryModal = () => {
    setEditingCategoryTitle(null);
    setNewCategory({ title: "", tempServiceName: "", servicesList: [] });
    setIsModalOpen(true);
  };

  const handleOpenAddNewsModal = () => {
    setSelectedArticleForEdit(null);
    setIsBlogEditorOpen(true);
  };

  const handleOpenAddFaqModal = () => {
    setEditingFaqId(null);
    setNewFaq({ question: "", answer: "" });
    setIsModalOpen(true);
  };

  // Queue Handlers
  const handleStartEditQueue = (q) => {
    setEditingQueueId(q.id);
    setNewQueue({
      patientName: q.patientName,
      kategoriLayanan: "",
      service: q.service,
      doctor: q.doctor,
      date: q.date
    });
    setIsModalOpen(true);
  };

  const handleCancelEditQueue = () => {
    setEditingQueueId(null);
    setNewQueue({ patientName: "", kategoriLayanan: "", service: "", doctor: "", date: "Hari Ini" });
  };

  const handleAddQueue = async () => {
    if (!newQueue.patientName.trim() || !newQueue.doctor || !newQueue.service) return;

    if (editingQueueId) {
      const payload = {
        patientName: newQueue.patientName.trim(),
        doctor: newQueue.doctor,
        service: newQueue.service,
        date: newQueue.date
      };
      await apiService.updateQueue(editingQueueId, payload);
      const updated = queues.map((q) => (q.id === editingQueueId ? { ...q, ...payload } : q));
      setQueues(updated);
      apiService.saveQueuesLocal(updated);
      setEditingQueueId(null);
    } else {
      const payload = {
        patientName: newQueue.patientName.trim(),
        doctor: newQueue.doctor,
        service: newQueue.service,
        date: newQueue.date,
        time: "09:00 WIB",
        status: "Menunggu Antrean"
      };
      const created = await apiService.createQueue(payload);
      const item = created || {
        id: `Q-00${queues.length + 1}`,
        queueNumber: `A-0${Math.floor(Math.random() * 80) + 20}`,
        ...payload
      };
      const updated = [...queues, item];
      setQueues(updated);
      apiService.saveQueuesLocal(updated);
    }
    setNewQueue({ patientName: "", kategoriLayanan: "", service: "", doctor: "", date: "Hari Ini" });
    setIsModalOpen(false);
  };

  const handleUpdateQueueStatus = async (id, newStatus) => {
    await apiService.updateQueue(id, { status: newStatus });
    const updated = queues.map((q) => (q.id === id ? { ...q, status: newStatus } : q));
    setQueues(updated);
    apiService.saveQueuesLocal(updated);
  };

  const handleDeleteQueue = async (id) => {
    await apiService.deleteQueue(id);
    const updated = queues.filter((q) => q.id !== id);
    setQueues(updated);
    apiService.saveQueuesLocal(updated);
  };

  // Doctor Handlers
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
    setIsModalOpen(true);
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

  const handleAddDoctor = async () => {
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

    const payload = {
      doctor: newDoctor.doctor.trim(),
      role: newDoctor.role.trim() || "Praktisi Medis",
      image: newDoctor.image || "/img/landingPage/dummyDr.png",
      startDay: startDay,
      endDay: endDay,
      startTime: startTime,
      endTime: endTime,
      services: servicesList
    };

    if (editingDoctorName) {
      const docObj = doctors.find((d) => d.doctor === editingDoctorName);
      if (docObj?.id) {
        await apiService.updateDoctor(docObj.id, payload);
      }
      const updated = doctors.map((d) =>
        d.doctor === editingDoctorName
          ? {
            ...d,
            ...payload,
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
      );
      setDoctors(updated);
      apiService.saveDoctorsLocal(updated);
      setEditingDoctorName(null);
    } else {
      const created = await apiService.createDoctor(payload);
      const docItem = created || {
        ...payload,
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
      const updated = [...doctors, docItem];
      setDoctors(updated);
      apiService.saveDoctorsLocal(updated);
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
    setIsModalOpen(false);
  };

  const handleDeleteDoctor = async (docName) => {
    const docObj = doctors.find((d) => d.doctor === docName);
    if (docObj?.id) {
      await apiService.deleteDoctor(docObj.id);
    }
    const updated = doctors.filter((d) => d.doctor !== docName);
    setDoctors(updated);
    apiService.saveDoctorsLocal(updated);
  };

  // Category Handlers
  const handleStartEditCategory = (cat) => {
    setEditingCategoryTitle(cat.title);
    setNewCategory({
      title: cat.title,
      tempServiceName: "",
      servicesList: [...cat.list]
    });
    setIsModalOpen(true);
  };

  const handleCancelEditCategory = () => {
    setEditingCategoryTitle(null);
    setNewCategory({ title: "", tempServiceName: "", servicesList: [] });
  };

  const handleAddCategory = async () => {
    if (!newCategory.title.trim()) return;

    const payload = {
      title: newCategory.title.trim(),
      list: newCategory.servicesList
    };

    if (editingCategoryTitle) {
      const catObj = categories.find((c) => c.title === editingCategoryTitle);
      if (catObj?.id) {
        await apiService.updateCategory(catObj.id, payload);
      }
      const updated = categories.map((c) =>
        c.title === editingCategoryTitle ? { ...c, ...payload } : c
      );
      setCategories(updated);
      apiService.saveCategoriesLocal(updated);
      setEditingCategoryTitle(null);
    } else {
      const created = await apiService.createCategory(payload);
      const item = created || payload;
      const updated = [...categories, item];
      setCategories(updated);
      apiService.saveCategoriesLocal(updated);
    }
    setNewCategory({ title: "", tempServiceName: "", servicesList: [] });
    setIsModalOpen(false);
  };

  const handleDeleteCategory = async (title) => {
    const catObj = categories.find((c) => c.title === title);
    if (catObj?.id) {
      await apiService.deleteCategory(catObj.id);
    }
    const updated = categories.filter((c) => c.title !== title);
    setCategories(updated);
    apiService.saveCategoriesLocal(updated);
  };

  // News & Blog Handlers
  const handleStartEditNews = (n) => {
    setSelectedArticleForEdit(n);
    setIsBlogEditorOpen(true);
  };

  const handleSaveBlogArticle = async (formData) => {
    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      summary: formData.summary.trim(),
      content: formData.content,
      author: formData.author,
      image: formData.image,
      readTime: formData.readTime,
      read_time: formData.readTime,
    };

    if (selectedArticleForEdit && selectedArticleForEdit.id) {
      await apiService.updateNews(selectedArticleForEdit.id, payload);
      const updated = news.map((n) =>
        n.id === selectedArticleForEdit.id ? { ...n, ...payload } : n
      );
      setNews(updated);
      apiService.saveNewsLocal(updated);
    } else {
      const now = new Date();
      const created = await apiService.createNews({
        ...payload,
        date: `${now.getDate()} Agustus 2026`,
      });
      const item = created || {
        id: Date.now(),
        date: `${now.getDate()} Agustus 2026`,
        ...payload,
      };
      const updated = [item, ...news];
      setNews(updated);
      apiService.saveNewsLocal(updated);
    }

    setIsBlogEditorOpen(false);
    setSelectedArticleForEdit(null);
  };

  const handleDeleteNews = async (id) => {
    await apiService.deleteNews(id);
    const updated = news.filter((n) => n.id !== id);
    setNews(updated);
    apiService.saveNewsLocal(updated);
  };

  // FAQ Handlers
  const handleStartEditFaq = (f) => {
    setEditingFaqId(f.id);
    setNewFaq({
      question: f.question,
      answer: f.answer
    });
    setIsModalOpen(true);
  };

  const handleCancelEditFaq = () => {
    setEditingFaqId(null);
    setNewFaq({ question: "", answer: "" });
  };

  const handleAddFaq = async () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;

    const payload = {
      question: newFaq.question.trim(),
      answer: newFaq.answer.trim()
    };

    if (editingFaqId) {
      await apiService.updateFaq(editingFaqId, payload);
      const updated = faqs.map((f) => (f.id === editingFaqId ? { ...f, ...payload } : f));
      setFaqs(updated);
      apiService.saveFaqsLocal(updated);
      setEditingFaqId(null);
    } else {
      const created = await apiService.createFaq(payload);
      const item = created || {
        id: Date.now(),
        ...payload
      };
      const updated = [...faqs, item];
      setFaqs(updated);
      apiService.saveFaqsLocal(updated);
    }
    setNewFaq({ question: "", answer: "" });
    setIsModalOpen(false);
  };

  const handleDeleteFaq = async (id) => {
    await apiService.deleteFaq(id);
    const updated = faqs.filter((f) => f.id !== id);
    setFaqs(updated);
    apiService.saveFaqsLocal(updated);
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

  const adminMenuItems = [
    { id: "overview", label: "Overview" },
    { id: "antrean", label: "Kelola Antrean" },
    { id: "dokter", label: "Kelola Dokter & Jadwal" },
    { id: "poli", label: "Poli & Layanan" },
    { id: "artikel", label: "Kelola Artikel" },
    { id: "faq", label: "Kelola FAQ" }
  ];

  return (
    <DashboardLayout
      menuItems={adminMenuItems}
      activeMenu={activeMenu}
      onMenuChange={setActiveMenu}
      userInfo={{
        title: "Administrator Klinik",
        subtitle: "Panel Kelola Operasional & Pelayanan"
      }}
    >
      {/* 0. Ringkasan Eksekutif & Operasional Overview */}
            {activeMenu === "overview" && (
              <>
                <div className={styles.header}>
                  <p className={styles.title}>Ringkasan Eksekutif & Operasional Klinik</p>
                  <p className={styles.desc}>Overview statistik kunjungan pasien, praktisi medis, poli layanan, dan berita kesehatan.</p>
                </div>

                {/* 4 Stat Cards Grid */}
                <div className={styles.overviewGrid}>
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>Total Kunjungan / Antrean</span>
                    <span className={styles.statValue}>{queues.length} Pasien</span>
                    <span className={styles.statDesc}>Terdaftar di sistem klinik</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>Dokter & Bidan Aktif</span>
                    <span className={styles.statValue}>{doctors.length} Praktisi</span>
                    <span className={styles.statDesc}>Tim medis profesional</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>Kategori & Poli</span>
                    <span className={styles.statValue}>{categories.length} Kategori</span>
                    <span className={styles.statDesc}>{allClinicServices.length} Layanan spesifik</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>Artikel Edukasi</span>
                    <span className={styles.statValue}>{news.length} Artikel</span>
                    <span className={styles.statDesc}>Dipublikasikan di portal</span>
                  </div>
                </div>

                {/* Two Column Section: Status Breakdown & Category Distribution */}
                <div className={styles.twoColumnGrid}>
                  {/* Status Antrean Breakdown */}
                  <div className={styles.cardSection}>
                    <p className={styles.title} style={{ fontSize: "18px", margin: 0 }}>
                      Status Antrean Pasien Hari Ini
                    </p>

                    <div className={styles.progressItem}>
                      <div className={styles.progressLabelRow}>
                        <span>Menunggu Antrean</span>
                        <span>{queues.filter((q) => q.status === "Menunggu Antrean").length} Pasien</span>
                      </div>
                      <div className={styles.progressBarTrack}>
                        <div
                          className={styles.progressBarFill}
                          style={{
                            width: queues.length > 0
                              ? `${(queues.filter((q) => q.status === "Menunggu Antrean").length / queues.length) * 100}%`
                              : "0%",
                            backgroundColor: "#c2410c"
                          }}
                        />
                      </div>
                    </div>

                    <div className={styles.progressItem}>
                      <div className={styles.progressLabelRow}>
                        <span>Sedang Dipanggil / Pelayanan</span>
                        <span>{queues.filter((q) => q.status === "Dipanggil").length} Pasien</span>
                      </div>
                      <div className={styles.progressBarTrack}>
                        <div
                          className={styles.progressBarFill}
                          style={{
                            width: queues.length > 0
                              ? `${(queues.filter((q) => q.status === "Dipanggil").length / queues.length) * 100}%`
                              : "0%",
                            backgroundColor: "var(--primary)"
                          }}
                        />
                      </div>
                    </div>

                    <div className={styles.progressItem}>
                      <div className={styles.progressLabelRow}>
                        <span>Selesai Konsultasi</span>
                        <span>{queues.filter((q) => q.status === "Selesai").length} Pasien</span>
                      </div>
                      <div className={styles.progressBarTrack}>
                        <div
                          className={styles.progressBarFill}
                          style={{
                            width: queues.length > 0
                              ? `${(queues.filter((q) => q.status === "Selesai").length / queues.length) * 100}%`
                              : "0%",
                            backgroundColor: "#16a34a"
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Kategori Pelayanan Utama */}
                  <div className={styles.cardSection}>
                    <p className={styles.title} style={{ fontSize: "18px", margin: 0 }}>
                      Distribusi Layanan per Kategori
                    </p>
                    {categories.map((cat, idx) => (
                      <div key={idx} className={styles.progressItem}>
                        <div className={styles.progressLabelRow}>
                          <span>{cat.title}</span>
                          <span>{cat.list.length} Layanan</span>
                        </div>
                        <div className={styles.progressBarTrack}>
                          <div
                            className={styles.progressBarFill}
                            style={{
                              width: allClinicServices.length > 0
                                ? `${(cat.list.length / allClinicServices.length) * 100}%`
                                : "0%"
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Antrean Table Preview */}
                <div className={styles.inputContainer}>
                  <div className={styles.tableHeaderRow}>
                    <p className={styles.title}>Antrean Terbaru</p>
                    <Button
                      onClick={() => setActiveMenu("antrean")}
                    >
                      Lihat Semua Antrean →
                    </Button>
                  </div>

                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>No. Antrean</th>
                          <th>Nama Pasien</th>
                          <th>Dokter / Bidan</th>
                          <th>Layanan</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {queues.slice(0, 5).map((q) => (
                          <tr key={q.id} className={styles.tableTr}>
                            <td style={{ fontWeight: "600", color: "var(--primary)" }}>{q.queueNumber}</td>
                            <td style={{ fontWeight: "500" }}>{q.patientName}</td>
                            <td>{q.doctor}</td>
                            <td>{q.service}</td>
                            <td>
                              <span className={`${styles.statusText} ${q.status === "Dipanggil" ? styles.statusActive : q.status === "Selesai" ? styles.statusDone : styles.statusPending}`}>
                                {q.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* 1. CRUD Antrean Pasien */}
            {activeMenu === "antrean" && (
              <>
                <div className={styles.header}>
                  <p className={styles.title}>Kelola Antrean Pasien Walk-In</p>
                  <p className={styles.desc}>Verifikasi dan buat antrean pasien langsung di lokasi klinik.</p>
                </div>

                <div className={styles.inputContainer}>
                  <div className={styles.tableHeaderRow}>
                    <div>
                      <p className={styles.title}>Daftar Antrean Aktif ({filteredQueues.length})</p>
                    </div>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <div style={{ width: "160px" }}>
                        <InputSelect
                          label=""
                          options={["Hari Ini", "Besok", "Semua"]}
                          value={queueDateFilter}
                          onChange={(val) => setQueueDateFilter(val)}
                          placeholder="Filter Tanggal"
                        />
                      </div>
                      <Button
                        onClick={handleOpenAddQueueModal}
                      >
                        + Tambah Antrean Walk-In
                      </Button>
                    </div>
                  </div>

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
                                  <Button
                                    size="sm"
                                    onClick={() => handleUpdateQueueStatus(q.id, "Dipanggil")}
                                  >
                                    Panggil
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleStartEditQueue(q)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleUpdateQueueStatus(q.id, "Selesai")}
                                  >
                                    Selesai
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handleDeleteQueue(q.id)}
                                  >
                                    Hapus
                                  </Button>
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

                <div className={styles.inputContainer}>
                  <div className={styles.tableHeaderRow}>
                    <p className={styles.title}>Daftar Dokter Terdaftar ({doctors.length})</p>
                    <Button
                      onClick={handleOpenAddDoctorModal}
                    >
                      + Tambah Dokter Baru
                    </Button>
                  </div>

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
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleStartEditDoctor(doc)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleDeleteDoctor(doc.doctor)}
                                >
                                  Hapus
                                </Button>
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

            {/* 3. CRUD Poli & Kategori Layanan */}
            {activeMenu === "poli" && (
              <>
                <div className={styles.header}>
                  <p className={styles.title}>Kelola Poli & Kategori Layanan</p>
                  <p className={styles.desc}>Tambah dan kelola jenis kategori pelayanan resmi klinik.</p>
                </div>

                <div className={styles.inputContainer}>
                  <div className={styles.tableHeaderRow}>
                    <p className={styles.title}>Daftar Kategori Layanan ({categories.length})</p>
                    <Button
                      onClick={handleOpenAddCategoryModal}
                    >
                      + Tambah Kategori Layanan
                    </Button>
                  </div>

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
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleStartEditCategory(cat)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleDeleteCategory(cat.title)}
                                >
                                  Hapus
                                </Button>
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

            {/* 4. CRUD Artikel & Berita */}
            {activeMenu === "artikel" && (
              <>
                <div className={styles.header}>
                  <p className={styles.title}>Kelola Artikel & Berita Kesehatan</p>
                  <p className={styles.desc}>Publikasikan artikel edukasi kesehatan ibu dan anak.</p>
                </div>

                <div className={styles.inputContainer}>
                  <div className={styles.tableHeaderRow}>
                    <p className={styles.title}>Daftar Artikel Terbit ({news.length})</p>
                    <Button
                      onClick={handleOpenAddNewsModal}
                    >
                      + Tambah Artikel Baru
                    </Button>
                  </div>

                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Judul Artikel</th>
                          <th>Kategori</th>
                          <th>Penulis</th>
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
                            <td style={{ fontSize: "13px", color: "#374151" }}>{n.author || "Tim Redaksi"}</td>
                            <td style={{ fontSize: "13px" }}>{n.date}</td>
                            <td style={{ fontSize: "13px", color: "#4b5563", maxWidth: "260px" }}>{n.summary}</td>
                            <td>
                              <div className={styles.actionCell}>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => setSelectedArticleForPreview(n)}
                                >
                                  Pratinjau
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleStartEditNews(n)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleDeleteNews(n.id)}
                                >
                                  Hapus
                                </Button>
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

            {/* 5. CRUD FAQ */}
            {activeMenu === "faq" && (
              <>
                <div className={styles.header}>
                  <p className={styles.title}>Kelola FAQ (Pertanyaan Umum)</p>
                  <p className={styles.desc}>Atur pertanyaan dan jawaban pusat bantuan pasien.</p>
                </div>

                <div className={styles.inputContainer}>
                  <div className={styles.tableHeaderRow}>
                    <p className={styles.title}>Daftar Pertanyaan FAQ ({faqs.length})</p>
                    <Button
                      onClick={handleOpenAddFaqModal}
                    >
                      + Tambah FAQ Baru
                    </Button>
                  </div>

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
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleStartEditFaq(f)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleDeleteFaq(f.id)}
                                >
                                  Hapus
                                </Button>
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

        {/* Modal Window Popup */}
        {isModalOpen && (
          <div className={styles.modalBackdrop} onClick={() => setIsModalOpen(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <p className={styles.modalTitle}>
                  {activeMenu === "antrean" && (editingQueueId ? "Edit Antrean Walk-In" : "Tambah Antrean Walk-In Baru")}
                  {activeMenu === "dokter" && (editingDoctorName ? "Edit Data & Jadwal Dokter" : "Tambah Dokter Baru")}
                  {activeMenu === "poli" && (editingCategoryTitle ? "Edit Kategori / Layanan" : "Tambah Kategori / Layanan Baru")}
                  {activeMenu === "artikel" && (editingNewsId ? "Edit Artikel" : "Tambah Artikel Baru")}
                  {activeMenu === "faq" && (editingFaqId ? "Edit FAQ" : "Tambah Pertanyaan FAQ Baru")}
                </p>
                <button type="button" className={styles.modalCloseBtn} onClick={() => setIsModalOpen(false)}>
                  ✕
                </button>
              </div>

              <div className={styles.inputWrapper}>
                {activeMenu === "antrean" && (
                  <>
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
                  </>
                )}

                {activeMenu === "dokter" && (
                  <>
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
                      <Button
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
                      </Button>
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
                  </>
                )}

                {activeMenu === "poli" && (
                  <>
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
                      <Button
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
                      </Button>
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
                  </>
                )}

                {activeMenu === "artikel" && (
                  <>
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
                  </>
                )}

                {activeMenu === "faq" && (
                  <>
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
                  </>
                )}
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
                <Button
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  onClick={() => {
                    if (activeMenu === "antrean") handleAddQueue();
                    if (activeMenu === "dokter") handleAddDoctor();
                    if (activeMenu === "poli") handleAddCategory();
                    if (activeMenu === "artikel") handleAddNews();
                    if (activeMenu === "faq") handleAddFaq();
                  }}
                >
                  {activeMenu === "antrean" && (editingQueueId ? "Simpan Perubahan Antrean" : "Terbitkan Antrean")}
                  {activeMenu === "dokter" && (editingDoctorName ? "Simpan Perubahan Dokter" : "Simpan Dokter Baru")}
                  {activeMenu === "poli" && (editingCategoryTitle ? "Simpan Perubahan Kategori" : "Simpan Kategori / Layanan")}
                  {activeMenu === "artikel" && (editingNewsId ? "Simpan Perubahan Artikel" : "Publikasikan Artikel")}
                  {activeMenu === "faq" && (editingFaqId ? "Simpan Perubahan FAQ" : "Simpan Pertanyaan FAQ")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Blog Editor Modal for Admin */}
        <BlogEditorModal
          isOpen={isBlogEditorOpen}
          onClose={() => {
            setIsBlogEditorOpen(false);
            setSelectedArticleForEdit(null);
          }}
          onSave={handleSaveBlogArticle}
          initialData={selectedArticleForEdit}
        />

        {/* Blog Reader Modal for Preview */}
        <BlogReaderModal
          isOpen={!!selectedArticleForPreview}
          onClose={() => setSelectedArticleForPreview(null)}
          article={selectedArticleForPreview}
        />
    </DashboardLayout>
  );
}
