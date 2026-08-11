import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserDashboard.module.css";
import Button from "../../components/Button/Button";
import dummyData from "../../json/UserDashboardDummy.json";
import dummyDokter from "../../json/DummyDokter.json";
import layanan from "../../json/Layanan.json";
import { InputSelect, InputPassword, InputRadio } from "../../components/Input";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("antrean");

  const [currentUser, setCurrentUser] = useState(null);
  const [activeQueue, setActiveQueue] = useState(null);

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
    const registeredUserRaw = localStorage.getItem("registeredUser");

    let foundUser = dummyData.users.find((u) => u.username === loggedInUsername);

    if (!foundUser && registeredUserRaw) {
      try {
        const reg = JSON.parse(registeredUserRaw);
        if (reg.username === loggedInUsername || !loggedInUsername) {
          foundUser = {
            username: reg.username || "pasien_baru",
            password: reg.password || "123",
            patient: {
              name: reg.nama || "Pasien Baru",
              noRM: reg.noRM || "RM-2026-99012",
              noBpjs: reg.noBpjs || "-",
              phone: reg.telepon || "-",
              email: reg.email || "-",
              address: reg.alamat || "-"
            },
            hasActiveQueue: true,
            activeQueue: {
              queueNumber: "A-015",
              doctor: reg.dokter || "dr. Aulia Rahma, Sp.A",
              specialty: "Spesialis Anak & Kebidanan",
              service: reg.layanan || "Pemeriksaan Kehamilan",
              date: reg.tanggalLayanan || "Hari Ini",
              time: "09:00 WIB",
              estimatedTime: "09:15 WIB",
              status: "Menunggu Antrean",
              currentCalling: "A-012",
              location: "Poli Utama - Ruang 101"
            },
            visitHistory: []
          };
        }
      } catch (err) {
      }
    }

    if (!foundUser) {
      foundUser = dummyData.users[0];
    }

    setCurrentUser(foundUser);
    setActiveQueue(foundUser.hasActiveQueue ? foundUser.activeQueue : null);
  }, []);

  const getDayName = (dateVal) => {
    const daysMap = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const now = new Date();

    if (dateVal === "Hari Ini" || !dateVal) {
      return daysMap[now.getDay()];
    }
    if (dateVal === "Besok") {
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      return daysMap[tomorrow.getDay()];
    }
    if (dateVal && dateVal.length === 10) {
      const parts = dateVal.split("/");
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        if (!isNaN(d.getTime())) {
          return daysMap[d.getDay()];
        }
      }
    }
    return null;
  };

  const selectCategoryObj = layanan.find((item) => item.title === newQueueData.kategoriLayanan);
  const listLayanan = selectCategoryObj?.list || [];

  const currentDayName = getDayName(newQueueData.tanggalLayanan);

  const availableDoctors = dummyDokter.filter((doc) => {
    return doc.schedules.some((sched) => {
      const matchService = !newQueueData.layanan || sched.services.includes(newQueueData.layanan);
      const matchDay = !currentDayName || sched.days.includes(currentDayName);
      return matchService && matchDay;
    });
  });

  const doctorOptions = availableDoctors.map((doc) => doc.doctor);

  const handleCreateQueue = () => {
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

    const createdQueue = {
      queueNumber: `A-0${Math.floor(Math.random() * 80) + 20}`,
      doctor: newQueueData.dokter,
      specialty: "Pelayanan Ibu & Anak",
      service: newQueueData.layanan,
      date: newQueueData.tanggalLayanan,
      time: "10:00 WIB",
      estimatedTime: "10:15 WIB",
      status: "Menunggu Antrean",
      currentCalling: "A-012",
      location: "Poli Utama - Ruang 102"
    };

    setActiveQueue(createdQueue);
    setNewQueueData({ tanggalLayanan: "", kategoriLayanan: "", layanan: "", dokter: "" });
  };

  const handleCancelQueue = () => {
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

    setSettingsSuccess("Password berhasil diperbarui.");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Logo" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div className={styles.confirm}>
            <p className={styles.label}>Selamat datang, {currentUser.patient.name}</p>
            <p className={styles.value}>{currentUser.patient.noRM}</p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              localStorage.removeItem("loggedInUser");
              navigate("/login");
            }}
          >
            Keluar
          </Button>
        </div>
      </div>

      <div className={styles.thirdContainer}>
        <div className={styles.menuWrapper}>
          <div
            className={`${styles.menuItem} ${activeMenu === "antrean" ? styles.menuItemActive : ""}`}
            onClick={() => setActiveMenu("antrean")}
          >
            Antrean Online
          </div>
          <div
            className={`${styles.menuItem} ${activeMenu === "riwayat" ? styles.menuItemActive : ""}`}
            onClick={() => setActiveMenu("riwayat")}
          >
            Riwayat Pelayanan
          </div>
          <div
            className={`${styles.menuItem} ${activeMenu === "berita" ? styles.menuItemActive : ""}`}
            onClick={() => setActiveMenu("berita")}
          >
            Berita & Edukasi
          </div>
          <div
            className={`${styles.menuItem} ${activeMenu === "faq" ? styles.menuItemActive : ""}`}
            onClick={() => setActiveMenu("faq")}
          >
            FAQ
          </div>
          <div
            className={`${styles.menuItem} ${activeMenu === "pengaturan" ? styles.menuItemActive : ""}`}
            onClick={() => setActiveMenu("pengaturan")}
          >
            Pengaturan
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

        <div className={styles.rightWrapper}>
          {activeMenu === "antrean" && (
            <>
              <div className={styles.header}>
                <p className={styles.title}>Antrean Online Saya</p>
                <p className={styles.desc}>Pantau antrean aktif Anda atau buat janji antrean baru langsung dari jadwal praktisi.</p>
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
                        <p className={styles.value}>{activeQueue.status} (Dipanggil saat ini: {activeQueue.currentCalling})</p>
                      </div>
                      <div className={styles.confirm}>
                        <p className={styles.label}>Lokasi Ruangan</p>
                        <p className={styles.value}>{activeQueue.location}</p>
                      </div>
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
                        options={["Hari Ini", "Besok"]}
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
                        options={layanan.map((item) => item.title)}
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
                <p className={styles.title}>Artikel Terbaru</p>
                {dummyData.news.map((item) => (
                  <div key={item.id} className={styles.inputWrapper}>
                    <div className={styles.confirm}>
                      <p className={styles.label}>{item.category} • {item.date}</p>
                      <p className={styles.value} style={{ fontWeight: 600, fontSize: "18px" }}>{item.title}</p>
                    </div>
                    <div className={styles.confirm}>
                      <p className={styles.value}>{item.summary}</p>
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
                {dummyData.faqs.map((item) => (
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
        </div>
      </div>
    </div>
  );
}
