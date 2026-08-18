import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserDashboard.module.css";
import Button from "../../components/Button/Button";
import { InputSelect, InputPassword, InputRadio } from "../../components/Input";
import BlogReaderModal from "../../components/BlogEditor/BlogReaderModal";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import { apiService } from "../../services/apiService";
import Title from "../../components/Title/Title";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("antrean");

  const [currentUser, setCurrentUser] = useState(null);
  const [activeQueue, setActiveQueue] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [newsPage, setNewsPage] = useState(1);
  const [faqList, setFaqList] = useState([]);

  const [newQueueData, setNewQueueData] = useState({
    tanggalLayanan: "",
    kategoriLayanan: "",
    layanan: "",
    dokter: ""
  });
  const [queueFormError, setQueueFormError] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");

  useEffect(() => {
    const loggedInUsername = localStorage.getItem("loggedInUser");
    if (!loggedInUsername) {
      navigate("/login", { replace: true });
      return;
    }

    const savedProfile = localStorage.getItem("user_profile_" + loggedInUsername);
    const registeredUserRaw = localStorage.getItem("registeredUser");

    let userObj = null;

    if (savedProfile) {
      try {
        userObj = JSON.parse(savedProfile);
      } catch (e) { }
    } else if (registeredUserRaw) {
      try {
        const reg = JSON.parse(registeredUserRaw);
        userObj = {
          username: reg.username || loggedInUsername,
          patient: {
            name: reg.nama || loggedInUsername,
            noRM: reg.noRM || "RM-2026-00123",
            noBpjs: reg.noBpjs || "-",
            phone: reg.telepon || "-",
            email: reg.email || "-",
            address: reg.alamat || "-"
          },
          visitHistory: []
        };
      } catch (e) { }
    }

    if (!userObj) {
      userObj = {
        username: loggedInUsername,
        patient: {
          name: loggedInUsername.charAt(0).toUpperCase() + loggedInUsername.slice(1),
          noRM: "RM-2026-00123",
          noBpjs: "-",
          phone: "-",
          email: "-",
          address: "-"
        },
        visitHistory: []
      };
    }

    setCurrentUser(userObj);

    const savedUserQueue = localStorage.getItem("user_active_queue_" + loggedInUsername);
    if (savedUserQueue) {
      try {
        setActiveQueue(JSON.parse(savedUserQueue));
      } catch (e) {
        setActiveQueue(null);
      }
    } else {
      setActiveQueue(null);
    }
  }, [navigate]);

  useEffect(() => {
    async function fetchDynamicData() {
      const catsData = await apiService.getCategories();
      setCategoriesList(catsData);
      const docsData = await apiService.getDoctors();
      setDoctorsList(docsData);
      const newsData = await apiService.getNews();
      setNewsList(newsData);
      const faqsData = await apiService.getFaqs();
      setFaqList(faqsData);

      const loggedInUsername = localStorage.getItem("loggedInUser");
      if (loggedInUsername) {
        const savedUserQueue = localStorage.getItem("user_active_queue_" + loggedInUsername);
        if (savedUserQueue) {
          try {
            const parsed = JSON.parse(savedUserQueue);
            const allQueues = await apiService.getQueues();
            const match = allQueues.find((q) => String(q.id) === String(parsed.id) || q.queueNumber === parsed.queueNumber);
            if (match) {
              setActiveQueue(match);
              localStorage.setItem("user_active_queue_" + loggedInUsername, JSON.stringify(match));
            }
          } catch (e) { }
        }
      }
    }
    fetchDynamicData();
  }, [activeMenu]);

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

  const getDayName = (dateVal) => {
    const daysMap = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    if (!dateVal) return daysMap[new Date().getDay()];

    const lower = String(dateVal).toLowerCase().trim();
    if (lower === "hari ini" || lower === "today" || dateVal === getTodayStr()) {
      return daysMap[new Date().getDay()];
    }
    if (lower === "besok" || lower === "tomorrow" || dateVal === getTomorrowStr()) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return daysMap[tomorrow.getDay()];
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) {
      const [y, m, d] = dateVal.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      return daysMap[dateObj.getDay()];
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateVal)) {
      const [d, m, y] = dateVal.split("/").map(Number);
      const dateObj = new Date(y, m - 1, d);
      return daysMap[dateObj.getDay()];
    }

    const parsed = new Date(dateVal);
    if (!isNaN(parsed.getTime())) {
      return daysMap[parsed.getDay()];
    }
    return null;
  };

  const selectCategoryObj = categoriesList.find((item) => item.title === newQueueData.kategoriLayanan);
  const listLayanan = selectCategoryObj?.list || selectCategoryObj?.services || [];

  const currentDayName = getDayName(newQueueData.tanggalLayanan);

  const availableDoctors = doctorsList.filter((doc) => {
    return (doc.schedules || []).some((sched) => {
      const matchService =
        !newQueueData.layanan ||
        (sched.services || []).some(
          (s) => s.toLowerCase().trim() === newQueueData.layanan.toLowerCase().trim()
        );
      const matchDay = !currentDayName || (sched.days || []).includes(currentDayName);
      return matchService && matchDay;
    });
  });

  const doctorOptions = availableDoctors.map((doc) => doc.doctor);

  const handleCreateQueue = async () => {
    setQueueFormError("");

    if (!newQueueData.tanggalLayanan) {
      setQueueFormError("Tanggal layanan wajib dipilih.");
      return;
    }
    if (!newQueueData.kategoriLayanan) {
      setQueueFormError("Kategori layanan wajib dipilih.");
      return;
    }
    if (!newQueueData.layanan) {
      setQueueFormError("Layanan wajib dipilih.");
      return;
    }
    if (!newQueueData.dokter) {
      setQueueFormError("Dokter wajib dipilih.");
      return;
    }

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

    const payload = {
      patientName: currentUser?.patient?.name || "Pasien",
      doctor: newQueueData.dokter,
      specialty: "Pelayanan Ibu & Anak",
      service: newQueueData.layanan,
      date: getRealDateTimestamp(newQueueData.tanggalLayanan),
      time: "10:00 WIB",
      estimatedTime: "10:15 WIB",
      status: "Menunggu Antrean",
      currentCalling: "A-012",
      location: "Poli Utama - Ruang 102"
    };

    const created = await apiService.createQueue(payload);
    const createdQueue = created || {
      id: Date.now(),
      queueNumber: `A-0${Math.floor(Math.random() * 80) + 20}`,
      ...payload
    };

    if (currentUser?.username) {
      localStorage.setItem("user_active_queue_" + currentUser.username, JSON.stringify(createdQueue));
    }

    setActiveQueue(createdQueue);
    setNewQueueData({ tanggalLayanan: "", kategoriLayanan: "", layanan: "", dokter: "" });
  };

  const handleCancelQueue = async () => {
    if (activeQueue?.id) {
      await apiService.deleteQueue(activeQueue.id);
    }
    if (currentUser?.username) {
      localStorage.removeItem("user_active_queue_" + currentUser.username);
    }
    setActiveQueue(null);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setSettingsError("");
    setSettingsSuccess("");

    if (!oldPassword) {
      setSettingsError("Password lama wajib diisi.");
      return;
    }
    if (!newPassword) {
      setSettingsError("Password baru wajib diisi.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setSettingsError("Konfirmasi password baru tidak cocok.");
      return;
    }

    if (currentUser?.username) {
      const updatedUser = { ...currentUser, password: newPassword };
      setCurrentUser(updatedUser);
      localStorage.setItem("user_profile_" + currentUser.username, JSON.stringify(updatedUser));
    }

    setSettingsSuccess("Password berhasil diperbarui.");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (!currentUser) {
    return null;
  }

  const userMenuItems = [
    {
      id: "antrean", label: "Antrean Online", svg:
        <svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.102 6.34707V8.07807H1.904V1.87207H0V14.2861H1.904V11.4491H22.102V14.5231H24V6.34507L22.102 6.34707Z" fill="currentColor" />
          <path d="M8.709 6.365C8.709 6.929 8.252 7.387 7.687 7.387H3.793C3.65871 7.38726 3.5257 7.36101 3.40158 7.30974C3.27747 7.25848 3.1647 7.18321 3.06975 7.08825C2.97479 6.9933 2.89952 6.88053 2.84826 6.75641C2.79699 6.6323 2.77073 6.49928 2.771 6.365V6.363C2.771 5.799 3.228 5.341 3.793 5.341H7.687C8.251 5.341 8.709 5.798 8.709 6.363V6.365ZM19.743 2.364H17.373V0H15.693V2.365H13.328V4.045H15.692V6.41H17.372V4.045H19.742L19.743 2.364Z" fill="white" />
        </svg>
    },
    {
      id: "riwayat", label: "Riwayat Pelayanan", svg:
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18C6.7 18 4.696 17.2377 2.988 15.713C1.28 14.1883 0.300667 12.284 0.0499999 10H2.1C2.33333 11.7333 3.10433 13.1667 4.413 14.3C5.72167 15.4333 7.25067 16 9 16C10.95 16 12.6043 15.321 13.963 13.963C15.3217 12.605 16.0007 10.9507 16 9C15.9993 7.04933 15.3203 5.39533 13.963 4.038C12.6057 2.68067 10.9513 2.00133 9 2C7.85 2 6.775 2.26667 5.775 2.8C4.775 3.33333 3.93333 4.06667 3.25 5H6V7H0V1H2V3.35C2.85 2.28333 3.88767 1.45833 5.113 0.875C6.33833 0.291667 7.634 0 9 0C10.25 0 11.421 0.237667 12.513 0.713C13.605 1.18833 14.555 1.82967 15.363 2.637C16.171 3.44433 16.8127 4.39433 17.288 5.487C17.7633 6.57967 18.0007 7.75066 18 9C17.9993 10.2493 17.762 11.4203 17.288 12.513C16.814 13.6057 16.1723 14.5557 15.363 15.363C14.5537 16.1703 13.6037 16.812 12.513 17.288C11.4223 17.764 10.2513 18.0013 9 18ZM11.8 13.2L8 9.4V4H10V8.6L13.2 11.8L11.8 13.2Z" fill="currentColor" />
        </svg>
    },
    {
      id: "berita", label: "Berita & Edukasi", svg:
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.44444 13C1.04722 13 0.707296 12.8587 0.424667 12.5761C0.142037 12.2934 0.000481481 11.9533 0 11.5556V1.44444C0 1.04722 0.141556 0.707296 0.424667 0.424667C0.707778 0.142037 1.0477 0.000481481 1.44444 0H11.5556C11.9528 0 12.2929 0.141556 12.5761 0.424667C12.8592 0.707778 13.0005 1.0477 13 1.44444V11.5556C13 11.9528 12.8587 12.2929 12.5761 12.5761C12.2934 12.8592 11.9533 13.0005 11.5556 13H1.44444ZM2.88889 10.1111H7.94444V8.66667H2.88889V10.1111ZM2.88889 7.22222H10.1111V5.77778H2.88889V7.22222ZM2.88889 4.33333H10.1111V2.88889H2.88889V4.33333Z" fill="currentColor" />
        </svg>
    },
    {
      id: "faq", label: "FAQ", svg:
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 0C6.95385 0 6.15385 0.8 6.15385 1.84615V5.53846C6.15385 6.58462 6.95385 7.38462 8 7.38462H11.6923L14.1538 9.84615V7.38462C15.2 7.38462 16 6.58462 16 5.53846V1.84615C16 0.8 15.2 0 14.1538 0H8ZM10.5772 1.84615H11.6345L12.6732 5.53846H11.7502L11.4997 4.61538H10.5766L10.3465 5.53846H9.53846L10.5772 1.84615ZM11.0769 2.46154C11.0154 2.70769 10.9465 3.008 10.8843 3.19262L10.712 4H11.4425L11.2689 3.192C11.1465 3.008 11.0769 2.70769 11.0769 2.46154ZM1.84615 6.15385C0.8 6.15385 0 6.95385 0 8V11.6923C0 12.7385 0.8 13.5385 1.84615 13.5385V16L4.30769 13.5385H8C9.04615 13.5385 9.84615 12.7385 9.84615 11.6923V8H8C6.83077 8 5.904 7.2 5.59631 6.15385H1.84615ZM4.67323 7.94215C5.71938 7.94215 6.21169 8.80369 6.21169 9.78831C6.21169 10.6498 5.91569 11.1963 5.42338 11.4425C5.66954 11.5655 5.96123 11.6308 6.26892 11.6923L6.03877 12.3077C5.608 12.1846 5.16123 11.9926 4.73046 11.8074C4.66892 11.7458 4.56123 11.7502 4.49969 11.7502C3.76123 11.6886 3.07692 11.0769 3.07692 9.84615C3.07692 8.8 3.68862 7.94215 4.67323 7.94215ZM4.67323 8.61538C4.18092 8.61538 3.94215 9.16923 3.94215 9.84615C3.94215 10.5846 4.18092 11.0769 4.67323 11.0769C5.16554 11.0769 5.42277 10.5231 5.42277 9.84615C5.42277 9.16923 5.16554 8.61538 4.67323 8.61538Z" fill="currentColor" />
        </svg>
    },
    {
      id: "pengaturan", label: "Pengaturan", svg:
        <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.43732 18C7.20465 18 7.00298 17.9237 6.83232 17.771C6.66098 17.6183 6.55465 17.428 6.51332 17.2L6.25032 15.108C5.93098 15.0113 5.58565 14.86 5.21432 14.654C4.84365 14.4473 4.52798 14.226 4.26732 13.99L2.35232 14.814C2.14098 14.9073 1.92632 14.9173 1.70832 14.844C1.49032 14.7707 1.32232 14.6323 1.20432 14.429L0.125316 12.57C0.00731607 12.3667 -0.0273507 12.154 0.021316 11.932C0.0699826 11.71 0.185983 11.528 0.369316 11.386L2.04132 10.136C2.01132 9.95467 1.98698 9.76834 1.96832 9.577C1.94832 9.385 1.93832 9.19867 1.93832 9.018C1.93832 8.85 1.94832 8.67334 1.96832 8.488C1.98698 8.30267 2.01132 8.094 2.04132 7.862L0.369316 6.612C0.185983 6.47 0.073316 6.285 0.031316 6.057C-0.010684 5.829 0.0269828 5.613 0.144316 5.409L1.20432 3.609C1.32232 3.41767 1.49032 3.28234 1.70832 3.203C1.92632 3.12367 2.14098 3.13067 2.35232 3.224L4.24832 4.028C4.54698 3.77934 4.87032 3.555 5.21832 3.355C5.56498 3.155 5.90265 3.00034 6.23132 2.891L6.51432 0.799004C6.55498 0.571004 6.66098 0.380671 6.83232 0.228004C7.00365 0.0753376 7.20532 -0.000662319 7.43732 4.34783e-06H9.51732C9.74998 4.34783e-06 9.95165 0.0763378 10.1223 0.229004C10.2936 0.381671 10.4 0.572004 10.4413 0.800004L10.7043 2.912C11.0876 3.04667 11.4263 3.201 11.7203 3.375C12.0143 3.549 12.3173 3.767 12.6293 4.029L14.6213 3.225C14.8333 3.13167 15.0483 3.12467 15.2663 3.204C15.4843 3.28334 15.652 3.41867 15.7693 3.61L16.8293 5.429C16.9473 5.633 16.982 5.84567 16.9333 6.067C16.8846 6.28834 16.7686 6.47067 16.5853 6.614L14.8373 7.92C14.892 8.12667 14.9226 8.31634 14.9293 8.48901C14.936 8.66167 14.9393 8.83167 14.9393 8.999C14.9393 9.15434 14.9326 9.318 14.9193 9.49C14.9066 9.66267 14.8773 9.87134 14.8313 10.116L16.5213 11.386C16.7046 11.528 16.824 11.71 16.8793 11.932C16.9346 12.154 16.9033 12.3667 16.7853 12.57L15.7193 14.409C15.602 14.613 15.431 14.7513 15.2063 14.824C14.9816 14.8973 14.7637 14.8873 14.5523 14.794L12.6293 13.97C12.318 14.232 12.0046 14.4563 11.6893 14.643C11.374 14.8297 11.0456 14.978 10.7043 15.088L10.4403 17.199C10.3996 17.427 10.2936 17.6173 10.1223 17.77C9.95098 17.9227 9.74932 17.9993 9.51732 18H7.43732ZM8.45032 11.5C9.14765 11.5 9.73865 11.2577 10.2233 10.773C10.708 10.2883 10.9503 9.69734 10.9503 9C10.9503 8.30267 10.708 7.71167 10.2233 7.227C9.73865 6.74234 9.14765 6.5 8.45032 6.5C7.74898 6.5 7.15698 6.74234 6.67432 7.227C6.19165 7.71167 5.95032 8.30267 5.95032 9C5.95032 9.69734 6.19165 10.2883 6.67432 10.773C7.15698 11.2577 7.74898 11.5 8.45032 11.5Z" fill="currentColor" />
        </svg>
    }
  ];

  return (
    <DashboardLayout
      menuItems={userMenuItems}
      activeMenu={activeMenu}
      onMenuChange={setActiveMenu}
      userInfo={{
        title: currentUser.patient.name,
        subtitle: "Pasien"
      }}
    >
      {activeMenu === "antrean" && (
        <>
          <div className={styles.header}>
            <Title
              title="Antrean Online Saya"
              desc="Pantau antrean aktif Anda atau buat janji antrean baru langsung dari jadwal praktisi."
            />
          </div>

          <div className={styles.inputContainer}>
            {activeQueue && activeQueue.status !== "Selesai" && activeQueue.status !== "Dibatalkan" ? (
              <>
                <div className={styles.inputWrapper}>
                  <div className={styles.confirm}>
                    <p className={styles.label}>Nomor Antrean</p>
                    <p className={styles.value}>{activeQueue.queueNumber}</p>
                  </div>
                  <div className={styles.input}>
                    <div className={styles.confirm}>
                      <p className={styles.label}>Dokter / Bidan</p>
                      <p className={styles.value}>{activeQueue.doctor}</p>
                    </div>
                    <div className={styles.confirm}>
                      <p className={styles.label}>Spesialisasi / Peran</p>
                      <p className={styles.value}>{activeQueue.specialty}</p>
                    </div>
                  </div>
                  <div className={styles.confirm}>
                    <p className={styles.label}>Layanan</p>
                    <p className={styles.value}>{activeQueue.service}</p>
                  </div>
                  <div className={styles.input}>
                    <div className={styles.confirm}>
                      <p className={styles.label}>Tanggal & Jam Kunjungan</p>
                      <p className={styles.value}>{activeQueue.date} ({activeQueue.time})</p>
                    </div>
                    <div className={styles.confirm}>
                      <p className={styles.label}>Estimasi Pelayanan</p>
                      <p className={styles.value}>{activeQueue.estimatedTime}</p>
                    </div>
                  </div>
                  <div className={styles.confirm}>
                    <p className={styles.label}>Status Antrean</p>
                    <p className={styles.value}>{activeQueue.status}</p>
                  </div>
                  <div className={styles.input} style={{ marginTop: "8px", gap: "12px" }}>
                    <Button
                      variant="secondary"
                      onClick={() => alert(`Lokasi Ruangan: ${activeQueue.location}`)}
                    >
                      Detail Lokasi
                    </Button>
                    <Button
                      variant="danger"
                      onClick={handleCancelQueue}
                    >
                      Batalkan Antrean
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {activeQueue && activeQueue.status === "Selesai" && (
                  <div style={{ padding: "16px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", color: "#166534", fontSize: "14px", fontWeight: "500", marginBottom: "16px" }}>
                    ✓ Pelayanan antrean Anda sebelumnya ({activeQueue.queueNumber}) telah <strong>Selesai</strong>. Anda dapat membuat janji antrean baru di bawah ini.
                  </div>
                )}
                <div>
                  <p className={styles.title}>Buat Antrean Baru</p>
                  <p className={styles.desc} style={{ margin: 0, fontFamily: "var(--font-artico)" }}>
                    Silakan pilih tanggal dan praktisi medis dari daftar jadwal di bawah untuk membuat antrean baru.
                  </p>
                </div>

                <div className={styles.inputWrapper}>
                  <InputSelect
                    label="Tanggal Layanan"
                    options={[
                      { value: getTodayStr(), label: `Hari Ini (${getTodayStr()})` },
                      { value: getTomorrowStr(), label: `Besok (${getTomorrowStr()})` }
                    ]}
                    value={newQueueData.tanggalLayanan}
                    onChange={(val) => {
                      setNewQueueData({
                        ...newQueueData,
                        tanggalLayanan: val,
                        dokter: ""
                      });
                    }}
                    placeholder="Pilih Tanggal Layanan"
                  />

                  <InputRadio
                    label="Kategori Layanan"
                    options={categoriesList.map((item) => item.title)}
                    value={newQueueData.kategoriLayanan}
                    onChange={(val) => {
                      setNewQueueData({
                        ...newQueueData,
                        kategoriLayanan: val,
                        layanan: "",
                        dokter: ""
                      });
                    }}
                  />

                  <InputSelect
                    label="Layanan"
                    options={listLayanan}
                    value={newQueueData.layanan}
                    onChange={(val) => {
                      setNewQueueData({
                        ...newQueueData,
                        layanan: val,
                        dokter: ""
                      });
                    }}
                    placeholder="Pilih Layanan"
                  />

                  <InputSelect
                    label="Pilih Dokter / Bidan"
                    options={doctorOptions}
                    value={newQueueData.dokter}
                    onChange={(val) => {
                      setNewQueueData({
                        ...newQueueData,
                        dokter: val
                      });
                    }}
                    placeholder="Pilih Dokter / Bidan"
                  />

                  {queueFormError && (
                    <p style={{ color: "#ef4444", fontSize: "14px", margin: "4px 0 0 0", fontFamily: "var(--font-artico)" }}>
                      {queueFormError}
                    </p>
                  )}
                </div>

                <div style={{ marginTop: "8px" }}>
                  <Button onClick={handleCreateQueue}>
                    Buat Antrean Baru
                  </Button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {activeMenu === "riwayat" && (
        <>
          <div className={styles.header}>
            <Title
              title="Riwayat Pelayanan Pasien"
              desc="Catatan riwayat kunjungan dan rekam medis digital Anda."
            />
          </div>

          <div className={styles.inputContainer}>
            {currentUser.visitHistory.length > 0 ? (
              currentUser.visitHistory.map((item) => (
                <div key={item.id} className={styles.inputWrapper}>
                  <div className={styles.confirm}>
                    <p className={styles.label}>{item.date} - {item.service}</p>
                    <p className={styles.value}>{item.doctor}</p>
                  </div>
                  <div className={styles.confirm}>
                    <p className={styles.label}>Diagnosa / Hasil Pemeriksaan</p>
                    <p className={styles.value}>{item.diagnosis}</p>
                  </div>
                  <div className={styles.confirm}>
                    <p className={styles.label}>Catatan Medis</p>
                    <p className={styles.value}>{item.notes}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.desc}>Belum ada riwayat kunjungan medis tercatat.</p>
            )}
          </div>
        </>
      )}

      {activeMenu === "berita" && (() => {
        const newsPerPage = 10;
        const totalNewsPages = Math.ceil(newsList.length / newsPerPage) || 1;
        const currentNewsList = newsList.slice((newsPage - 1) * newsPerPage, newsPage * newsPerPage);

        const isFirstPage = newsPage === 1;
        const featuredMain = isFirstPage && currentNewsList.length > 0 ? currentNewsList[0] : null;
        const featuredSide = isFirstPage && currentNewsList.length > 1 ? currentNewsList.slice(1, 5) : [];
        const gridList = isFirstPage ? currentNewsList.slice(5, 10) : currentNewsList;

        return (
          <>
            <div className={styles.header}>
              <Title
                title="Berita & Edukasi Kesehatan"
                desc="Informasi dan tips seputar pelayanan kesehatan ibu dan anak."
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {isFirstPage && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: currentNewsList.length > 1 ? "1.2fr 1fr" : "1fr", gap: "24px", alignItems: "stretch" }}>
                    {featuredMain && (
                      <div
                        style={{
                          backgroundColor: "white",
                          borderRadius: "20px",
                          padding: "24px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                          display: "flex",
                          flexDirection: "column",
                          justify: "space-between",
                          cursor: "pointer"
                        }}
                        onClick={() => setSelectedArticle(featuredMain)}
                      >
                        <div>
                          <div style={{ width: "100%", height: "240px", borderRadius: "14px", overflow: "hidden", marginBottom: "16px" }}>
                            <img
                              src={featuredMain.image || "/img/landingPage/artikel1.png"}
                              alt={featuredMain.title}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => { e.target.src = "/img/landingPage/artikel1.png"; }}
                            />
                          </div>
                          <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 6px 0" }}>
                            {featuredMain.category} • {featuredMain.readTime || featuredMain.read_time || "3 min read"} • {featuredMain.date}
                          </p>
                          <h3 style={{ fontFamily: "var(--font-antonia)", fontSize: "20px", fontWeight: 700, color: "var(--primary)", margin: "0 0 10px 0", lineHeight: "1.3" }}>
                            {featuredMain.title}
                          </h3>
                          <p style={{ fontFamily: "var(--font-artico)", fontSize: "14px", color: "#4b5563", margin: 0, lineHeight: "1.5" }}>
                            {featuredMain.summary}
                          </p>
                        </div>
                        <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); setSelectedArticle(featuredMain); }}>
                            Baca Selengkapnya
                          </Button>
                        </div>
                      </div>
                    )}

                    {featuredSide.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                          maxHeight: "520px",
                          overflowY: "auto"
                        }}
                      >
                        {featuredSide.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              backgroundColor: "white",
                              borderRadius: "16px",
                              padding: "16px",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                              display: "flex",
                              gap: "14px",
                              alignItems: "center",
                              cursor: "pointer",
                              flex: 1
                            }}
                            onClick={() => setSelectedArticle(item)}
                          >
                            <div style={{ width: "90px", height: "70px", borderRadius: "10px", overflow: "hidden", flexShrink: 0 }}>
                              <img
                                src={item.image || "/img/landingPage/artikel2.png"}
                                alt={item.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => { e.target.src = "/img/landingPage/artikel2.png"; }}
                              />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 4px 0" }}>
                                {item.category} • {item.date}
                              </p>
                              <h4 style={{ fontFamily: "var(--font-antonia)", fontSize: "15px", fontWeight: 700, color: "#1F2937", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {item.title}
                              </h4>
                              <p style={{ fontSize: "13px", color: "#6b7280", margin: "4px 0 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {item.summary}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {gridList.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                      {gridList.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            backgroundColor: "white",
                            borderRadius: "16px",
                            padding: "20px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                            display: "flex",
                            flexDirection: "column",
                            justify: "space-between",
                            cursor: "pointer"
                          }}
                          onClick={() => setSelectedArticle(item)}
                        >
                          <div>
                            <div style={{ width: "100%", height: "160px", borderRadius: "12px", overflow: "hidden", marginBottom: "14px" }}>
                              <img
                                src={item.image || "/img/landingPage/artikel3.png"}
                                alt={item.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => { e.target.src = "/img/landingPage/artikel3.png"; }}
                              />
                            </div>
                            <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 4px 0" }}>
                              {item.category} • {item.date}
                            </p>
                            <h4 style={{ fontFamily: "var(--font-antonia)", fontSize: "16px", fontWeight: 700, color: "var(--primary)", margin: "0 0 8px 0" }}>
                              {item.title}
                            </h4>
                            <p style={{ fontSize: "13px", color: "#4b5563", margin: 0, lineHeight: "1.5" }}>
                              {item.summary}
                            </p>
                          </div>
                          <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                            <Button size="sm" onClick={(e) => { e.stopPropagation(); setSelectedArticle(item); }}>
                              Baca Selengkapnya
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {!isFirstPage && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                  {gridList.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: "white",
                        borderRadius: "16px",
                        padding: "20px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                        display: "flex",
                        flexDirection: "column",
                        justify: "space-between",
                        cursor: "pointer"
                      }}
                      onClick={() => setSelectedArticle(item)}
                    >
                      <div>
                        <div style={{ width: "100%", height: "160px", borderRadius: "12px", overflow: "hidden", marginBottom: "14px" }}>
                          <img
                            src={item.image || "/img/landingPage/artikel1.png"}
                            alt={item.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => { e.target.src = "/img/landingPage/artikel1.png"; }}
                          />
                        </div>
                        <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 4px 0" }}>
                          {item.category} • {item.date}
                        </p>
                        <h4 style={{ fontFamily: "var(--font-antonia)", fontSize: "16px", fontWeight: 700, color: "var(--primary)", margin: "0 0 8px 0" }}>
                          {item.title}
                        </h4>
                        <p style={{ fontSize: "13px", color: "#4b5563", margin: 0, lineHeight: "1.5" }}>
                          {item.summary}
                        </p>
                      </div>
                      <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                        <Button size="sm" onClick={(e) => { e.stopPropagation(); setSelectedArticle(item); }}>
                          Baca Selengkapnya
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {newsList.length > newsPerPage && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "12px", padding: "16px", backgroundColor: "white", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={newsPage === 1}
                    onClick={() => setNewsPage((p) => Math.max(p - 1, 1))}
                  >
                    Sebelumnya
                  </Button>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                    Halaman {newsPage} dari {totalNewsPages}
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={newsPage === totalNewsPages}
                    onClick={() => setNewsPage((p) => Math.min(p + 1, totalNewsPages))}
                  >
                    Selanjutnya
                  </Button>
                </div>
              )}
            </div>
          </>
        );
      })()}

      {activeMenu === "faq" && (
        <>
          <div className={styles.header}>
            <Title
              title="Pertanyaan Umum (FAQ)"
              desc="Jawaban atas pertanyaan yang paling sering ditanyakan mengenai pelayanan klinik."
            />
          </div>

          <div className={styles.inputContainer}>
            {faqList.map((item) => (
              <div key={item.id} className={styles.inputWrapper}>
                <div className={styles.confirm}>
                  <p className={styles.label}>{item.question}</p>
                  <p className={styles.value}>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeMenu === "pengaturan" && (
        <>
          <div className={styles.header}>
            <Title
              title="Pengaturan Akun"
              desc="Ubah kata sandi dan kelola keamanan akun Anda."
            />
          </div>

          <div className={styles.inputContainer}>
            <div className={styles.inputWrapper}>
              <InputPassword
                label="Password Lama"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Masukkan password lama anda"
              />
              <InputPassword
                label="Password Baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Masukkan password baru anda"
              />
              <InputPassword
                label="Konfirmasi Password Baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Konfirmasi password baru anda"
                error={settingsError}
              />
              {settingsSuccess && (
                <div className={styles.confirm}>
                  <p className={styles.value} style={{ color: "#10b981", fontWeight: 600 }}>
                    {settingsSuccess}
                  </p>
                </div>
              )}
            </div>

            <div className={styles.button} onClick={handlePasswordChange}>
              Simpan Perubahan
            </div>
          </div>
        </>
      )}
      {/* Blog Reader Modal for Patient */}
      <BlogReaderModal
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        article={selectedArticle}
      />
    </DashboardLayout>
  );
}
