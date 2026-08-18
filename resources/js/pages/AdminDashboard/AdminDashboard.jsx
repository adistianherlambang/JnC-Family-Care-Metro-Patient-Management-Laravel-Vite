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
import Table, { TableBadge } from "../../components/Table/Table";
import Title from "../../components/Title/Title";
import Modal from "../../components/Modal/Modal";

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
  const [patients, setPatients] = useState([]);

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
      const pList = await apiService.getPatients();
      setPatients(pList);
      isDataLoaded.current = true;
    }
    loadData();
  }, [navigate]);

  useEffect(() => {
    if (isDataLoaded.current) apiService.savePatientsLocal(patients);
  }, [patients]);

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
  const [queueDateFilter, setQueueDateFilter] = useState(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  });

  // Forms State
  const [newQueue, setNewQueue] = useState({
    patientName: "",
    kategoriLayanan: "",
    service: "",
    doctor: "",
    date: ""
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

  const [newPatient, setNewPatient] = useState({
    name: "",
    username: "",
    password: "",
    noRM: "",
    phone: "",
    email: "",
    noBpjs: "",
    address: ""
  });

  // Edit States
  const [editingQueueId, setEditingQueueId] = useState(null);
  const [editingDoctorName, setEditingDoctorName] = useState(null);
  const [editingCategoryTitle, setEditingCategoryTitle] = useState(null);
  const [editingNewsId, setEditingNewsId] = useState(null);
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [editingPatientId, setEditingPatientId] = useState(null);

  const handleOpenAddPatientModal = () => {
    setEditingPatientId(null);
    setNewPatient({
      name: "",
      username: "",
      password: "user123",
      noRM: `RM-2026-${Math.floor(Math.random() * 800) + 100}`,
      phone: "",
      email: "",
      noBpjs: "",
      address: ""
    });
    setIsModalOpen(true);
  };

  const handleAddPatient = async () => {
    if (!newPatient.name.trim()) {
      alert("Nama pasien wajib diisi!");
      return;
    }
    if (!newPatient.username.trim()) {
      alert("Username pasien wajib diisi!");
      return;
    }

    if (editingPatientId) {
      const payload = { ...newPatient, id: editingPatientId };
      await apiService.updatePatient(editingPatientId, payload);
      const updated = patients.map((item) => (item.id === editingPatientId ? payload : item));
      setPatients(updated);
      apiService.savePatientsLocal(updated);

      if (newPatient.username) {
        const userObj = {
          username: newPatient.username,
          password: newPatient.password,
          patient: {
            name: newPatient.name,
            noRM: newPatient.noRM,
            noBpjs: newPatient.noBpjs,
            phone: newPatient.phone,
            email: newPatient.email,
            address: newPatient.address
          }
        };
        localStorage.setItem("user_profile_" + newPatient.username, JSON.stringify(userObj));
        localStorage.setItem("registeredUser", JSON.stringify(userObj.patient));
      }
    } else {
      const payload = {
        id: Date.now(),
        ...newPatient
      };
      const created = await apiService.createPatient(payload);
      const updated = [created || payload, ...patients];
      setPatients(updated);
      apiService.savePatientsLocal(updated);
    }

    setIsModalOpen(false);
    setEditingPatientId(null);
    setNewPatient({ name: "", username: "", password: "", noRM: "", phone: "", email: "", noBpjs: "", address: "" });
  };

  const handleDeletePatient = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus akun pasien ini?")) {
      await apiService.deletePatient(id);
      const updated = patients.filter((item) => item.id !== id);
      setPatients(updated);
      apiService.savePatientsLocal(updated);
    }
  };

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

    const getRealDateTimestamp = (val) => {
      const today = new Date();
      if (!val) {
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      }
      const lower = String(val).toLowerCase().trim();
      if (lower === "hari ini" || lower === "today") {
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      }
      if (lower === "besok" || lower === "tomorrow") {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
      }
      return val;
    };

    if (editingQueueId) {
      const payload = {
        patientName: newQueue.patientName.trim(),
        doctor: newQueue.doctor,
        service: newQueue.service,
        date: getRealDateTimestamp(newQueue.date)
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
        date: getRealDateTimestamp(newQueue.date),
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
      list: newCategory.servicesList,
      services: newCategory.servicesList
    };

    if (editingCategoryTitle) {
      const catObj = categories.find((c) => c.title === editingCategoryTitle);
      let updatedItem = { ...catObj, ...payload };
      if (catObj?.id) {
        const res = await apiService.updateCategory(catObj.id, payload);
        if (res) updatedItem = res;
      } else {
        const res = await apiService.createCategory(payload);
        if (res) updatedItem = res;
      }
      const updated = categories.map((c) =>
        c.title === editingCategoryTitle ? updatedItem : c
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

  const filteredQueues = queues.filter((q) => {
    if (!queueDateFilter || queueDateFilter === "Semua") return true;
    return parseToTimestamp(q.date) === parseToTimestamp(queueDateFilter);
  });

  const isToday = (dateStr) => parseToTimestamp(dateStr) === getTodayStr();

  const adminCategoryObj = categories.find((c) => c.title === newQueue.kategoriLayanan);
  const adminServiceOptions = adminCategoryObj?.list || [];

  const allClinicServices = Array.from(new Set(categories.flatMap((c) => c.list)));

  const availableWalkinDoctors = doctors.filter((d) =>
    d.schedules.some((s) => !newQueue.service || s.services.includes(newQueue.service))
  );
  const doctorOptions = availableWalkinDoctors.map((d) => d.doctor);

  const adminMenuItems = [
    {
      id: "overview", label: "Overview", svg:
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 6V0H18V6H10ZM0 10V0H8V10H0ZM10 18V8H18V18H10ZM0 18V12H8V18H0Z" fill="currentColor" />
        </svg>
    },
    {
      id: "antrean", label: "Kelola Antrean", svg:
        <svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.102 6.34707V8.07807H1.904V1.87207H0V14.2861H1.904V11.4491H22.102V14.5231H24V6.34507L22.102 6.34707Z" fill="currentColor" />
          <path d="M8.709 6.365C8.709 6.929 8.252 7.387 7.687 7.387H3.793C3.65871 7.38726 3.5257 7.36101 3.40158 7.30974C3.27747 7.25848 3.1647 7.18321 3.06975 7.08825C2.97479 6.9933 2.89952 6.88053 2.84826 6.75641C2.79699 6.6323 2.77073 6.49928 2.771 6.365V6.363C2.771 5.799 3.228 5.341 3.793 5.341H7.687C8.251 5.341 8.709 5.798 8.709 6.363V6.365ZM19.743 2.364H17.373V0H15.693V2.365H13.328V4.045H15.692V6.41H17.372V4.045H19.742L19.743 2.364Z" fill="white" />
        </svg>
    },
    {
      id: "dokter", label: "Kelola Dokter & Jadwal", svg:
        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 8C8.06087 8 9.07828 7.57857 9.82843 6.82843C10.5786 6.07828 11 5.06087 11 4C11 2.93913 10.5786 1.92172 9.82843 1.17157C9.07828 0.421427 8.06087 0 7 0C5.93913 0 4.92172 0.421427 4.17157 1.17157C3.42143 1.92172 3 2.93913 3 4C3 5.06087 3.42143 6.07828 4.17157 6.82843C4.92172 7.57857 5.93913 8 7 8ZM4 9.725C1.6875 10.4031 0 12.5406 0 15.0719C0 15.5844 0.415625 16 0.928125 16H13.0719C13.5844 16 14 15.5844 14 15.0719C14 12.5406 12.3125 10.4031 10 9.725V11.3125C10.8625 11.5344 11.5 12.3188 11.5 13.25V14.5C11.5 14.775 11.275 15 11 15H10.5C10.225 15 10 14.775 10 14.5C10 14.225 10.225 14 10.5 14V13.25C10.5 12.6969 10.0531 12.25 9.5 12.25C8.94687 12.25 8.5 12.6969 8.5 13.25V14C8.775 14 9 14.225 9 14.5C9 14.775 8.775 15 8.5 15H8C7.725 15 7.5 14.775 7.5 14.5V13.25C7.5 12.3188 8.1375 11.5344 9 11.3125V9.52812C8.8125 9.50937 8.62188 9.5 8.42813 9.5H5.57188C5.37813 9.5 5.1875 9.50937 5 9.52812V11.5719C5.72188 11.7875 6.25 12.4563 6.25 13.25C6.25 14.2156 5.46562 15 4.5 15C3.53438 15 2.75 14.2156 2.75 13.25C2.75 12.4563 3.27812 11.7875 4 11.5719V9.725ZM4.5 14C4.69891 14 4.88968 13.921 5.03033 13.7803C5.17098 13.6397 5.25 13.4489 5.25 13.25C5.25 13.0511 5.17098 12.8603 5.03033 12.7197C4.88968 12.579 4.69891 12.5 4.5 12.5C4.30109 12.5 4.11032 12.579 3.96967 12.7197C3.82902 12.8603 3.75 13.0511 3.75 13.25C3.75 13.4489 3.82902 13.6397 3.96967 13.7803C4.11032 13.921 4.30109 14 4.5 14Z" fill="currentColor" />
        </svg>
    },
    {
      id: "pasien", label: "Kelola Akun Pasien", svg:
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor" />
        </svg>
    },
    {
      id: "poli", label: "Poli & Layanan", svg:
        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.01 0.00999999H1C0.733626 0.0118505 0.478833 0.119173 0.29141 0.30847C0.103987 0.497768 -0.00079548 0.753616 4.54779e-06 1.02V6.6C4.54779e-06 6.79 0.0500045 6.97 0.150005 7.13C0.250005 7.29 0.390004 7.42 0.550004 7.51L5.33 10.35C5.54 10.46 5.77 10.51 6 10.51C6.23 10.51 6.46 10.46 6.67 10.35L11.45 7.51C11.62 7.42 11.76 7.29 11.85 7.13C11.95 6.97 12 6.79 12 6.6V1.02C12 0.89 11.98 0.76 11.93 0.63C11.88 0.51 11.81 0.4 11.72 0.3C11.5354 0.111586 11.2838 0.00375705 11.02 0L11.01 0.00999999ZM9.01 5.51H7.01V7.51H5.01V5.51H3.01V3.51H5.01V1.51H7.01V3.51H9.01V5.51Z" fill="currentColor" />
        </svg>
    },
    {
      id: "artikel", label: "Kelola Artikel", svg:
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.44444 13C1.04722 13 0.707296 12.8587 0.424667 12.5761C0.142037 12.2934 0.000481481 11.9533 0 11.5556V1.44444C0 1.04722 0.141556 0.707296 0.424667 0.424667C0.707778 0.142037 1.0477 0.000481481 1.44444 0H11.5556C11.9528 0 12.2929 0.141556 12.5761 0.424667C12.8592 0.707778 13.0005 1.0477 13 1.44444V11.5556C13 11.9528 12.8587 12.2929 12.5761 12.5761C12.2934 12.8592 11.9533 13.0005 11.5556 13H1.44444ZM2.88889 10.1111H7.94444V8.66667H2.88889V10.1111ZM2.88889 7.22222H10.1111V5.77778H2.88889V7.22222ZM2.88889 4.33333H10.1111V2.88889H2.88889V4.33333Z" fill="currentColor" />
        </svg>
    },
    {
      id: "faq", label: "Kelola FAQ", svg:
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 0C6.95385 0 6.15385 0.8 6.15385 1.84615V5.53846C6.15385 6.58462 6.95385 7.38462 8 7.38462H11.6923L14.1538 9.84615V7.38462C15.2 7.38462 16 6.58462 16 5.53846V1.84615C16 0.8 15.2 0 14.1538 0H8ZM10.5772 1.84615H11.6345L12.6732 5.53846H11.7502L11.4997 4.61538H10.5766L10.3465 5.53846H9.53846L10.5772 1.84615ZM11.0769 2.46154C11.0154 2.70769 10.9465 3.008 10.8843 3.19262L10.712 4H11.4425L11.2689 3.192C11.1465 3.008 11.0769 2.70769 11.0769 2.46154ZM1.84615 6.15385C0.8 6.15385 0 6.95385 0 8V11.6923C0 12.7385 0.8 13.5385 1.84615 13.5385V16L4.30769 13.5385H8C9.04615 13.5385 9.84615 12.7385 9.84615 11.6923V8H8C6.83077 8 5.904 7.2 5.59631 6.15385H1.84615ZM4.67323 7.94215C5.71938 7.94215 6.21169 8.80369 6.21169 9.78831C6.21169 10.6498 5.91569 11.1963 5.42338 11.4425C5.66954 11.5655 5.96123 11.6308 6.26892 11.6923L6.03877 12.3077C5.608 12.1846 5.16123 11.9926 4.73046 11.8074C4.66892 11.7458 4.56123 11.7502 4.49969 11.7502C3.76123 11.6886 3.07692 11.0769 3.07692 9.84615C3.07692 8.8 3.68862 7.94215 4.67323 7.94215ZM4.67323 8.61538C4.18092 8.61538 3.94215 9.16923 3.94215 9.84615C3.94215 10.5846 4.18092 11.0769 4.67323 11.0769C5.16554 11.0769 5.42277 10.5231 5.42277 9.84615C5.42277 9.16923 5.16554 8.61538 4.67323 8.61538Z" fill="currentColor" />
        </svg>
    }
  ];

  return (
    <DashboardLayout
      menuItems={adminMenuItems}
      activeMenu={activeMenu}
      onMenuChange={setActiveMenu}
      userInfo={{
        title: "Administrator",
        subtitle: "Administrator Klinik",
        avatar: "A"
      }}
    >
      {/* Navigation Tab Bar */}
      <div className={styles.topTabBar}>
        {adminMenuItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.topTabBtn} ${activeMenu === item.id ? styles.topTabActive : ""}`}
            onClick={() => setActiveMenu(item.id)}
          >
            {item.svg}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* 0. Ringkasan Eksekutif & Operasional Overview */}
      {activeMenu === "overview" && (
        <>
          <div className={styles.header}>
            <Title
              title="Ringkasan Statistik"
              desc="Overview statistik kunjungan pasien, praktisi medis, poli layanan, dan berita kesehatan."
            />
          </div>

          {/* 4 Stat Cards Grid */}
          <div className={styles.overviewGrid}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total Antrean Hari Ini</span>
              <span className={styles.statValue}>{queues.filter((q) => isToday(q.date)).length} Pasien</span>
              <span className={styles.statDesc}>Terdaftar untuk pelayanan hari ini</span>
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
            <Table
              title="Antrean Terbaru Hari Ini"
              headerAction={
                <Button onClick={() => setActiveMenu("antrean")}>
                  Lihat Semua Antrean →
                </Button>
              }
            >
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
                {queues.filter((q) => isToday(q.date)).slice(0, 5).map((q) => (
                  <tr key={q.id}>
                    <td style={{ fontWeight: "600", color: "var(--primary)" }}>{q.queueNumber}</td>
                    <td style={{ fontWeight: "500" }}>{q.patientName}</td>
                    <td>{q.doctor}</td>
                    <td>{q.service}</td>
                    <td>
                      <TableBadge status={q.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}

      {/* 1. CRUD Antrean Pasien */}
      {activeMenu === "antrean" && (
        <>
          <div className={styles.header}>
            <Title
              title={"Kelola Antrean Pasien"}
              desc={"Verifikasi dan buat antrean pasien langsung di lokasi klinik."}
            />
          </div>

          <div className={styles.inputContainer}>
            <Table
              title={`Daftar Antrean Aktif`}
              headerAction={
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{ width: "160px" }}>
                    <InputSelect
                      label=""
                      options={[
                        { value: getTodayStr(), label: `Hari Ini` },
                        { value: getTomorrowStr(), label: `Besok` },
                        { value: "Semua", label: "Semua Tanggal" }
                      ]}
                      value={queueDateFilter}
                      onChange={(val) => setQueueDateFilter(val)}
                      placeholder="Filter Tanggal"
                    />
                  </div>
                  <Button onClick={handleOpenAddQueueModal}>
                    + Tambah Antrean Walk-In
                  </Button>
                </div>
              }
              emptyMessage={`Tidak ada antrean aktif pada tanggal terpilih (${queueDateFilter}).`}
            >
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
                  <tr key={q.id}>
                    <td style={{ fontWeight: "600", color: "var(--primary)" }}>{q.queueNumber}</td>
                    <td style={{ fontWeight: "500" }}>{q.patientName}</td>
                    <td>{q.doctor}</td>
                    <td>{q.service}</td>
                    <td>{q.date} • {q.time}</td>
                    <td>
                      <TableBadge status={q.status} />
                    </td>
                    <td>
                      <Table.ActionCell>
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
                      </Table.ActionCell>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}

      {/* 2. CRUD Dokter & Jadwal */}
      {activeMenu === "dokter" && (
        <>
          <div className={styles.header}>
            <Title
              title={"Kelola Data & Jadwal Praktik Dokter"}
              desc={"Tambah, edit, dan kelola profil dokter, foto, serta jadwal jam kerja praktik."}
            />
          </div>

          <div className={styles.inputContainer}>
            <Table
              title={`Daftar Dokter Terdaftar (${doctors.length})`}
              headerAction={
                <Button onClick={handleOpenAddDoctorModal}>
                  + Tambah Dokter Baru
                </Button>
              }
            >
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nama Dokter & Gelar</th>
                  <th>Peran / Spesialisasi</th>
                  <th>Info Akun Login</th>
                  <th>Jadwal Praktik</th>
                  <th>Layanan Utama</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc, idx) => {
                  const docUsername = doc.username || (doc.doctor.toLowerCase().includes("fitri") ? "bidan" : doc.doctor.toLowerCase().includes("aulia") ? "dr.aulia" : "bidan.siti");
                  const docPassword = doc.password || "bidan123";
                  return (
                    <tr key={idx}>
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
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--primary)" }}>
                          Username: {docUsername}
                        </div>
                        <div style={{ fontSize: "12px", color: "#4b5563", marginTop: "4px" }}>
                          🔑 Password: <code style={{ backgroundColor: "#f3f4f6", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>{docPassword}</code>
                        </div>
                      </td>
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
                        <Table.ActionCell>
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
                        </Table.ActionCell>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </>
      )}

      {/* 2.5. CRUD Kelola Akun Pasien */}
      {activeMenu === "pasien" && (
        <>
          <div className={styles.header}>
            <Title
              title="Kelola Akun & Data Pasien"
              desc="Tambah, edit, dan kelola data akun login pasien, username, kata sandi, serta informasi rekam medis."
            />
          </div>

          <div className={styles.inputContainer}>
            <Table
              title={`Daftar Akun Pasien (${patients.length})`}
              headerAction={
                <Button onClick={handleOpenAddPatientModal}>
                  + Tambah Pasien Baru
                </Button>
              }
            >
              <thead>
                <tr>
                  <th>No. RM</th>
                  <th>Nama Lengkap</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>No. Telepon / Email</th>
                  <th>Alamat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.noRM || item.no_rm}</strong></td>
                    <td>{item.name || item.patient_name}</td>
                    <td><span className={styles.codeBadge}>{item.username}</span></td>
                    <td><span className={styles.codeBadge}>•••••••• ({item.password || "user123"})</span></td>
                    <td>{item.phone || "-"} <br/><small style={{ color: "#6b7280" }}>{item.email || "-"}</small></td>
                    <td>{item.address || "-"}</td>
                    <td>
                      <Table.ActionCell>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setEditingPatientId(item.id);
                            setNewPatient({
                              name: item.name || item.patient_name || "",
                              username: item.username || "",
                              password: item.password || "",
                              noRM: item.noRM || item.no_rm || "",
                              phone: item.phone || "",
                              email: item.email || "",
                              noBpjs: item.noBpjs || item.no_bpjs || "",
                              address: item.address || ""
                            });
                            setIsModalOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeletePatient(item.id)}
                        >
                          Hapus
                        </Button>
                      </Table.ActionCell>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}

      {/* 3. CRUD Poli & Kategori Layanan */}
      {activeMenu === "poli" && (
        <>
          <div className={styles.header}>
            <Title
              title={"Kelola Poli & Kategori Layanan"}
              desc={"Tambah dan kelola jenis kategori pelayanan resmi klinik."}
            />
          </div>

          <div className={styles.inputContainer}>
            <Table
              title={`Daftar Kategori Layanan (${categories.length})`}
              headerAction={
                <Button onClick={handleOpenAddCategoryModal}>
                  + Tambah Kategori Layanan
                </Button>
              }
            >
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
                  <tr key={idx}>
                    <td style={{ fontWeight: "600", color: "#6b7280" }}>{idx + 1}</td>
                    <td style={{ fontWeight: "600", color: "var(--primary)" }}>{cat.title}</td>
                    <td>{cat.list.length} Layanan</td>
                    <td style={{ fontSize: "13px" }}>
                      {cat.list.length > 0 ? cat.list.join(", ") : "-"}
                    </td>
                    <td>
                      <Table.ActionCell>
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
                      </Table.ActionCell>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}

      {/* 4. CRUD Artikel & Berita */}
      {activeMenu === "artikel" && (
        <>
          <div className={styles.header}>
            <Title
              title={"Kelola Artikel & Berita Kesehatan"}
              desc={"Publikasikan artikel edukasi kesehatan ibu dan anak."}
            />
          </div>

          <div className={styles.inputContainer}>
            <Table
              title={`Daftar Artikel Terbit (${news.length})`}
              headerAction={
                <Button onClick={handleOpenAddNewsModal}>
                  + Tambah Artikel Baru
                </Button>
              }
            >
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
                  <tr key={n.id}>
                    <td style={{ fontWeight: "600", color: "#6b7280" }}>{idx + 1}</td>
                    <td style={{ fontWeight: "600", color: "var(--primary)" }}>{n.title}</td>
                    <td>
                      <TableBadge status="Aktif">{n.category}</TableBadge>
                    </td>
                    <td style={{ fontSize: "13px", color: "#374151" }}>{n.author || "Tim Redaksi"}</td>
                    <td style={{ fontSize: "13px" }}>{n.date}</td>
                    <td style={{ fontSize: "13px", color: "#4b5563", maxWidth: "260px" }}>{n.summary}</td>
                    <td>
                      <Table.ActionCell>
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
                      </Table.ActionCell>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}

      {/* 5. CRUD FAQ */}
      {activeMenu === "faq" && (
        <>
          <div className={styles.header}>
            <Title
              title={"Kelola FAQ (Pertanyaan Umum)"}
              desc={"Atur pertanyaan dan jawaban pusat bantuan pasien."}
            />
          </div>

          <div className={styles.inputContainer}>
            <Table
              title={`Daftar Pertanyaan FAQ (${faqs.length})`}
              headerAction={
                <Button onClick={handleOpenAddFaqModal}>
                  + Tambah FAQ Baru
                </Button>
              }
            >
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
                  <tr key={f.id}>
                    <td style={{ fontWeight: "600", color: "#6b7280" }}>{idx + 1}</td>
                    <td style={{ fontWeight: "600", color: "var(--primary)", maxWidth: "260px" }}>{f.question}</td>
                    <td style={{ fontSize: "13px", color: "#4b5563", maxWidth: "350px" }}>{f.answer}</td>
                    <td>
                      <Table.ActionCell>
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
                      </Table.ActionCell>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}

      {/* Modal Window Popup */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          activeMenu === "antrean" ? (editingQueueId ? "Edit Antrean Walk-In" : "Tambah Antrean Walk-In Baru") :
          activeMenu === "dokter" ? (editingDoctorName ? "Edit Data & Jadwal Dokter" : "Tambah Dokter Baru") :
          activeMenu === "pasien" ? (editingPatientId ? "Edit Akun & Data Pasien" : "Tambah Pasien Baru") :
          activeMenu === "poli" ? (editingCategoryTitle ? "Edit Layanan" : "Tambah Layanan Baru") :
          activeMenu === "artikel" ? (editingNewsId ? "Edit Artikel" : "Tambah Artikel Baru") :
          activeMenu === "faq" ? (editingFaqId ? "Edit FAQ" : "Tambah Pertanyaan FAQ Baru") : ""
        }
        footer={
          <>
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
                if (activeMenu === "pasien") handleAddPatient();
                if (activeMenu === "poli") handleAddCategory();
                if (activeMenu === "artikel") handleAddNews();
                if (activeMenu === "faq") handleAddFaq();
              }}
            >
              {activeMenu === "antrean" && (editingQueueId ? "Simpan Perubahan Antrean" : "Terbitkan Antrean")}
              {activeMenu === "dokter" && (editingDoctorName ? "Simpan Perubahan Dokter" : "Simpan Dokter Baru")}
              {activeMenu === "pasien" && (editingPatientId ? "Simpan Perubahan Pasien" : "Simpan Pasien Baru")}
              {activeMenu === "poli" && (editingCategoryTitle ? "Simpan Perubahan Kategori" : "Simpan Layanan")}
              {activeMenu === "artikel" && (editingNewsId ? "Simpan Perubahan Artikel" : "Publikasikan Artikel")}
              {activeMenu === "faq" && (editingFaqId ? "Simpan Perubahan FAQ" : "Simpan Pertanyaan FAQ")}
            </Button>
          </>
        }
      >
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
                options={[
                  { value: getTodayStr(), label: `Hari Ini (${getTodayStr()})` },
                  { value: getTomorrowStr(), label: `Besok (${getTomorrowStr()})` }
                ]}
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
              <div className={styles.input}>
                <InputText
                  label="Username Login Dokter"
                  value={newDoctor.username}
                  onChange={(e) => setNewDoctor({ ...newDoctor, username: e.target.value })}
                  placeholder="Contoh: bidan / dr.fitri"
                />
                <InputText
                  label="Password Login Dokter"
                  value={newDoctor.password}
                  onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
                  placeholder="Contoh: bidan123"
                />
              </div>
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

          {activeMenu === "pasien" && (
            <>
              <InputText
                label="Nama Lengkap Pasien"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                placeholder="Masukkan nama lengkap pasien"
              />
              <InputText
                label="Nomor Rekam Medis (No. RM)"
                value={newPatient.noRM}
                onChange={(e) => setNewPatient({ ...newPatient, noRM: e.target.value })}
                placeholder="Contoh: RM-2026-00123"
              />
              <div className={styles.input}>
                <InputText
                  label="Username Login Pasien"
                  value={newPatient.username}
                  onChange={(e) => setNewPatient({ ...newPatient, username: e.target.value })}
                  placeholder="Username untuk login pasien"
                />
                <InputText
                  label="Kata Sandi / Password"
                  value={newPatient.password}
                  onChange={(e) => setNewPatient({ ...newPatient, password: e.target.value })}
                  placeholder="Kata sandi akun pasien"
                />
              </div>
              <div className={styles.input}>
                <InputText
                  label="Nomor Telepon / WhatsApp"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                  placeholder="Contoh: 081234567890"
                />
                <InputText
                  label="Alamat Email"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                  placeholder="Contoh: pasien@gmail.com"
                />
              </div>
              <InputText
                label="Nomor BPJS Kesehatan (Opsional)"
                value={newPatient.noBpjs}
                onChange={(e) => setNewPatient({ ...newPatient, noBpjs: e.target.value })}
                placeholder="Masukkan nomor BPJS jika ada"
              />
              <InputText
                label="Alamat Lengkap"
                value={newPatient.address}
                onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                placeholder="Masukkan alamat domisili pasien"
              />
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
      </Modal>

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
