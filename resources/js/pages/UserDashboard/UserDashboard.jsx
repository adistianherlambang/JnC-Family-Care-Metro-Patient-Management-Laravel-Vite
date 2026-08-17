import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserDashboard.module.css";
import Button from "../../components/Button/Button";
import { InputSelect, InputPassword, InputRadio } from "../../components/Input";
import BlogReaderModal from "../../components/BlogEditor/BlogReaderModal";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import { apiService } from "../../services/apiService";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("antrean");

  const [currentUser, setCurrentUser] = useState(null);
  const [activeQueue, setActiveQueue] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [newsList, setNewsList] = useState([]);
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
  const listLayanan = selectCategoryObj?.list || [];

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
    { id: "antrean", label: "Antrean Online" },
    { id: "riwayat", label: "Riwayat Pelayanan" },
    { id: "berita", label: "Berita & Edukasi" },
    { id: "faq", label: "FAQ" },
    { id: "pengaturan", label: "Pengaturan" }
  ];

  return (
    <DashboardLayout
      menuItems={userMenuItems}
      activeMenu={activeMenu}
      onMenuChange={setActiveMenu}
      userInfo={{
        title: `Selamat datang, ${currentUser.patient.name}`,
        subtitle: currentUser.patient.noRM
      }}
    >
      {activeMenu === "antrean" && (
        <>
          <div className={styles.header}>
            <p className={styles.title}>Antrean Online Saya</p>
            <p className={styles.desc}>
              Pantau antrean aktif Anda atau buat janji antrean baru langsung dari jadwal praktisi.
            </p>
          </div>

          <div className={styles.inputContainer}>
            {activeQueue ? (
              <>
                <p className={styles.title}>Detail Antrean Aktif Anda</p>
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
                  <div className={styles.input}>
                    <div
                      className={styles.button}
                      onClick={() => alert(`Lokasi Ruangan: ${activeQueue.location}`)}
                    >
                      Detail Lokasi
                    </div>
                    <div
                      className={`${styles.button} ${styles.buttonDanger}`}
                      onClick={handleCancelQueue}
                    >
                      Batalkan Antrean
                    </div>
                  </div>
                </div>
              </>
            ) : (
                    <>
                      <p className={styles.title}>Anda Belum Memiliki Antrean Aktif</p>
                      <p className={styles.desc} style={{ margin: 0, fontFamily: "var(--font-artico)" }}>
                        Silakan pilih tanggal dan praktisi medis dari daftar jadwal di bawah untuk membuat antrean baru.
                      </p>

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

                      <div className={styles.button} onClick={handleCreateQueue}>
                        Buat Antrean Baru
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {activeMenu === "riwayat" && (
              <>
                <div className={styles.header}>
                  <p className={styles.title}>Riwayat Pelayanan Pasien</p>
                  <p className={styles.desc}>Catatan riwayat kunjungan dan rekam medis digital Anda.</p>
                </div>

                <div className={styles.inputContainer}>
                  <p className={styles.title}>Daftar Kunjungan Medis</p>
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

            {activeMenu === "berita" && (
              <>
                <div className={styles.header}>
                  <p className={styles.title}>Berita & Edukasi Kesehatan</p>
                  <p className={styles.desc}>Informasi dan tips seputar pelayanan kesehatan ibu dan anak.</p>
                </div>

                <div className={styles.inputContainer}>
                  <p className={styles.title}>Artikel & Edukasi Terbaru</p>
                  {newsList.map((item) => (
                    <div
                      key={item.id}
                      className={styles.inputWrapper}
                      style={{ cursor: "pointer", transition: "transform 0.2s ease" }}
                      onClick={() => setSelectedArticle(item)}
                    >
                      {item.image && (
                        <div style={{ width: "100%", height: "160px", borderRadius: "12px", overflow: "hidden", marginBottom: "12px" }}>
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                      <div className={styles.confirm}>
                        <p className={styles.label}>
                          {item.category} • {item.readTime || item.read_time || "3 min read"} • {item.date}
                        </p>
                        <p className={styles.value} style={{ fontWeight: 700, fontSize: "17px", color: "var(--primary)" }}>
                          {item.title}
                        </p>
                      </div>
                      <div className={styles.confirm}>
                        <p className={styles.value} style={{ color: "#4b5563" }}>{item.summary}</p>
                      </div>
                      <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedArticle(item);
                          }}
                        >
                          Baca Selengkapnya →
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeMenu === "faq" && (
              <>
                <div className={styles.header}>
                  <p className={styles.title}>Pertanyaan Umum (FAQ)</p>
                  <p className={styles.desc}>Jawaban atas pertanyaan yang paling sering ditanyakan mengenai pelayanan klinik.</p>
                </div>

                <div className={styles.inputContainer}>
                  <p className={styles.title}>Pusat Bantuan</p>
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
                  <p className={styles.title}>Pengaturan Akun</p>
                  <p className={styles.desc}>Ubah kata sandi dan kelola keamanan akun Anda.</p>
                </div>

                <div className={styles.inputContainer}>
                  <p className={styles.title}>Ubah Kata Sandi</p>
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
