const BASE_URL = "/api";

const getFormattedDate = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const DEFAULT_QUEUES = [
  {
    id: 1,
    queueNumber: "A-014",
    patientName: "Siti Nurhaliza",
    doctor: "dr. Fitri Handayani, Sp.A",
    service: "Konsultasi Tumbuh Kembang",
    date: getFormattedDate(0),
    time: "09:30 WIB",
    status: "Menunggu Antrean"
  },
  {
    id: 2,
    queueNumber: "A-015",
    patientName: "Budi Santoso",
    doctor: "dr. Aulia Rahma, Sp.OG",
    service: "Pemeriksaan Kehamilan",
    date: getFormattedDate(0),
    time: "10:00 WIB",
    status: "Sedang Dilayani"
  },
  {
    id: 3,
    queueNumber: "A-012",
    patientName: "Dewi Lestari",
    doctor: "Bidan Siti Rahmawati, S.Tr.Keb",
    service: "Treatment Laktasi",
    date: getFormattedDate(-2),
    time: "08:30 WIB",
    status: "Selesai"
  },
  {
    id: 4,
    queueNumber: "A-016",
    patientName: "Rina Anggraini",
    doctor: "Bidan Siti Rahmawati, S.Tr.Keb",
    service: "Baby Spa",
    date: getFormattedDate(1),
    time: "11:00 WIB",
    status: "Menunggu Antrean"
  }
];

const DEFAULT_PATIENTS = [
  {
    id: 1,
    name: "Siti Nurhaliza",
    username: "sitinurhaliza",
    password: "user123",
    noRM: "RM-2026-00101",
    phone: "081234567890",
    email: "siti.nurhaliza@gmail.com",
    noBpjs: "000123456781",
    address: "Jl. Pemuda No. 15, Metro"
  },
  {
    id: 2,
    name: "Budi Santoso",
    username: "budisantoso",
    password: "user123",
    noRM: "RM-2026-00102",
    phone: "081987654321",
    email: "budi.santoso@yahoo.com",
    noBpjs: "000123456782",
    address: "Jl. Ahmad Yani No. 8, Metro"
  },
  {
    id: 3,
    name: "Dewi Lestari",
    username: "dewilestari",
    password: "user123",
    noRM: "RM-2026-00103",
    phone: "085211223344",
    email: "dewi.lestari@gmail.com",
    noBpjs: "000123456783",
    address: "Jl. Raden Intan No. 42, Metro"
  },
  {
    id: 4,
    name: "Teddy Setiawan",
    username: "teddy",
    password: "user123",
    noRM: "RM-2026-00123",
    phone: "081299887766",
    email: "teddy@gmail.com",
    noBpjs: "000123456789",
    address: "Jl. Flamboyan No. 5, Metro"
  }
];

const DAYS_OF_WEEK = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const getDaysRange = (startDay, endDay) => {
  const start = startDay || "Senin";
  const end = endDay || "Jumat";
  const startIndex = DAYS_OF_WEEK.indexOf(start);
  const endIndex = DAYS_OF_WEEK.indexOf(end);
  if (startIndex === -1 || endIndex === -1) return [start, end];
  if (startIndex <= endIndex) {
    return DAYS_OF_WEEK.slice(startIndex, endIndex + 1);
  } else {
    return [...DAYS_OF_WEEK.slice(startIndex), ...DAYS_OF_WEEK.slice(0, endIndex + 1)];
  }
};

const DEFAULT_CATEGORIES = [
  {
    id: 1,
    title: "Poli",
    list: [
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
    services: [
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
    ]
  },
  {
    id: 2,
    title: "Mom's Treatment",
    list: [
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
    services: [
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
    ]
  },
  {
    id: 3,
    title: "Persalinan",
    list: [
      "Pelayanan Persalinan",
      "IMD (Inisiasi Menyusu Dini)",
      "Pendampingan Persalinan",
      "DCC (Delayed Cord Clamping)"
    ],
    services: [
      "Pelayanan Persalinan",
      "IMD (Inisiasi Menyusu Dini)",
      "Pendampingan Persalinan",
      "DCC (Delayed Cord Clamping)"
    ]
  },
  {
    id: 4,
    title: "Pelayanan Bayi dan Anak",
    list: [
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
    ],
    services: [
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
  }
];

const DEFAULT_DOCTORS = [
  {
    id: 1,
    doctor: "dr. Fitri Handayani, Sp.A",
    role: "Spesialis Anak & Tumbuh Kembang",
    image: "/img/landingPage/dummyDr.png",
    startDay: "Senin",
    endDay: "Jumat",
    startTime: "08:00",
    endTime: "14:00",
    services: [
      "Konsultasi Tumbuh Kembang",
      "Imunisasi",
      "MTBS/MTBM",
      "SHK (Skrining Hipotiroid Kongenital)",
      "Baby Infant dan Kids Massage",
      "Massage Common Cold",
      "Massage Diare",
      "Massage Konstipasi",
      "Massage Kolik",
      "Massage Kembung",
      "Baby Spa",
      "Baby Spa with Parents",
      "Cek Golongan Darah",
      "Tindik dr Evoo"
    ]
  },
  {
    id: 2,
    doctor: "dr. Aulia Rahma, Sp.OG",
    role: "Spesialis Kandungan & Kebidanan",
    image: "/img/landingPage/dummyDr.png",
    startDay: "Senin",
    endDay: "Sabtu",
    startTime: "09:00",
    endTime: "15:00",
    services: [
      "Pemeriksaan Kehamilan",
      "Pemeriksaan Nifas",
      "IVA",
      "Papsmear",
      "KB",
      "Pemeriksaan dan Konsultasi Catin (Persiapan Hamil, Melahirkan, Menyusui)",
      "Pelayanan Persalinan",
      "IMD (Inisiasi Menyusu Dini)",
      "Pendampingan Persalinan",
      "DCC (Delayed Cord Clamping)",
      "Prenatal Class Yoga",
      "Aquatic Yoga",
      "Kelas Melahirkan",
      "Washing V",
      "Special Pregnant Treatment"
    ]
  },
  {
    id: 3,
    doctor: "Bidan Siti Rahmawati, S.Tr.Keb",
    role: "Bidan Senior & Treatment Specialist",
    image: "/img/landingPage/dummyDr.png",
    startDay: "Selasa",
    endDay: "Minggu",
    startTime: "08:00",
    endTime: "16:00",
    services: [
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
      "Footbath",
      "Pelayanan Persalinan",
      "IMD (Inisiasi Menyusu Dini)",
      "Pendampingan Persalinan",
      "DCC (Delayed Cord Clamping)",
      "Pemeriksaan Kehamilan",
      "Pemeriksaan Nifas",
      "KB",
      "Pemeriksaan dan Konsultasi Catin (Persiapan Hamil, Melahirkan, Menyusui)",
      "Prenatal Class Yoga",
      "Aquatic Yoga",
      "Kelas Melahirkan",
      "IVA",
      "Washing V",
      "Baby Spa",
      "Baby Spa with Parents",
      "Mandi Bayi",
      "Cukur Bayi",
      "Jemur Bayi",
      "Baby Infant dan Kids Massage",
      "Massage Common Cold",
      "Massage Diare",
      "Massage Konstipasi",
      "Massage Kolik",
      "Massage Kembung",
      "Imunisasi",
      "Tindik Manual",
      "Tindik dr Evoo",
      "Potong Kuku",
      "Manicure",
      "Pedicure",
      "Hygiene Lidah, Telinga, dan Hidung"
    ]
  }
];

export const apiService = {
  // Patients (Connected to MySQL via /api/patients)
  async getPatients(fallback) {
    try {
      const res = await fetch(`${BASE_URL}/patients`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem("clinic_patients", JSON.stringify(data));
          return data;
        }
      } else {
        console.error("Fetch patients failed with status:", res.status);
      }
    } catch (e) {
      console.error("Fetch patients network/DB error:", e);
    }
    const local = localStorage.getItem("clinic_patients");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return fallback || DEFAULT_PATIENTS;
  },
  savePatientsLocal(data) {
    localStorage.setItem("clinic_patients", JSON.stringify(data));
  },
  async createPatient(data) {
    try {
      const res = await fetch(`${BASE_URL}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const created = await res.json();
        const current = await this.getPatients();
        this.savePatientsLocal([created, ...current.filter((p) => p.id !== created.id)]);
        return created;
      } else {
        const errText = await res.text();
        console.error("Gagal simpan pasien ke DB:", res.status, errText);
        alert(`Gagal menyimpan pasien ke Database (HTTP ${res.status}). Pastikan database MySQL cPanel sudah terhubung dan tabel 'patients' sudah di-import.`);
        return null;
      }
    } catch (e) {
      console.error("Error creating patient in DB:", e);
      alert("Terjadi kesalahan koneksi saat menyimpan pasien ke Database MySQL.");
      return null;
    }
  },
  async updatePatient(id, data) {
    try {
      const res = await fetch(`${BASE_URL}/patients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updated = await res.json();
        const current = await this.getPatients();
        this.savePatientsLocal(current.map((p) => (p.id === id ? updated : p)));
        return updated;
      } else {
        console.error("Gagal update pasien di DB:", res.status);
        alert(`Gagal memperbarui data pasien di Database (HTTP ${res.status}).`);
        return null;
      }
    } catch (e) {
      console.error("Error updating patient in DB:", e);
      alert("Terjadi kesalahan koneksi saat memperbarui pasien.");
      return null;
    }
  },
  async deletePatient(id) {
    try {
      const res = await fetch(`${BASE_URL}/patients/${id}`, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        const current = await this.getPatients();
        this.savePatientsLocal(current.filter((p) => p.id !== id));
        return true;
      } else {
        console.error("Gagal hapus pasien di DB:", res.status);
        alert(`Gagal menghapus akun pasien dari Database (HTTP ${res.status}).`);
        return false;
      }
    } catch (e) {
      console.error("Error deleting patient in DB:", e);
      return false;
    }
  },

  // Categories
  async getCategories(fallback) {
    try {
      const res = await fetch(`${BASE_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem("clinic_categories", JSON.stringify(data));
          return data;
        }
      } else {
        console.error("Fetch categories failed with status:", res.status);
      }
    } catch (e) {
      console.error("Categories fetch error:", e);
    }
    const local = localStorage.getItem("clinic_categories");
    return local ? JSON.parse(local) : (fallback || DEFAULT_CATEGORIES);
  },
  saveCategoriesLocal(data) {
    localStorage.setItem("clinic_categories", JSON.stringify(data));
  },
  async createCategory(data) {
    try {
      const res = await fetch(`${BASE_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
      const errText = await res.text();
      console.error("Error creating category:", res.status, errText);
      alert(`Gagal menyimpan kategori ke Database (HTTP ${res.status}). Periksa koneksi database MySQL.`);
    } catch (e) {
      console.error("Error creating category:", e);
      alert("Koneksi gagal saat menyimpan kategori ke database.");
    }
    return null;
  },
  async updateCategory(id, data) {
    try {
      const res = await fetch(`${BASE_URL}/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
      alert(`Gagal memperbarui kategori di Database (HTTP ${res.status}).`);
    } catch (e) {
      console.error("Error updating category:", e);
    }
    return null;
  },
  async deleteCategory(id) {
    try {
      const res = await fetch(`${BASE_URL}/categories/${id}`, { method: "DELETE" });
      if (res.ok) return true;
      alert(`Gagal menghapus kategori dari Database (HTTP ${res.status}).`);
    } catch (e) {
      console.error("Error deleting category:", e);
    }
    return false;
  },

  // Doctors
  normalizeDoctor(doc) {
    if (!doc || typeof doc !== "object") return doc;
    const startDay = doc.startDay || doc.start_day || doc.schedules?.[0]?.days?.[0] || "Senin";
    const endDay = doc.endDay || doc.end_day || doc.schedules?.[0]?.days?.[doc.schedules?.[0]?.days?.length - 1] || "Jumat";
    const startTime = doc.startTime || doc.start_time || doc.schedules?.[0]?.startTime || "08:00";
    const endTime = doc.endTime || doc.end_time || doc.schedules?.[0]?.endTime || "14:00";
    const services = Array.isArray(doc.services) && doc.services.length > 0
      ? doc.services
      : (doc.schedules?.[0]?.services || ["Konsultasi Umum"]);
    const daysList = getDaysRange(startDay, endDay);
    const displayDays = startDay === endDay ? startDay : `${startDay} - ${endDay}`;

    const schedules = (Array.isArray(doc.schedules) && doc.schedules.length > 0)
      ? doc.schedules.map((s) => {
          const sStart = s.days?.[0] || startDay;
          const sEnd = s.days?.[s.days?.length - 1] || endDay;
          const sDays = (Array.isArray(s.days) && s.days.length > 2)
            ? s.days
            : getDaysRange(sStart, sEnd);
          return {
            ...s,
            days: sDays,
            displayDays: s.displayDays || (sStart === sEnd ? sStart : `${sStart} - ${sEnd}`),
            startTime: s.startTime || startTime,
            endTime: s.endTime || endTime,
            services: Array.isArray(s.services) && s.services.length > 0 ? s.services : services
          };
        })
      : [
          {
            days: daysList,
            displayDays: displayDays,
            startTime,
            endTime,
            services
          }
        ];

    return {
      ...doc,
      startDay,
      endDay,
      startTime,
      endTime,
      services,
      schedules
    };
  },
  async getDoctors(fallback) {
    try {
      const res = await fetch(`${BASE_URL}/doctors`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map((d) => this.normalizeDoctor(d));
          localStorage.setItem("clinic_doctors", JSON.stringify(normalized));
          return normalized;
        }
      } else {
        console.error("Fetch doctors failed with status:", res.status);
      }
    } catch (e) {
      console.error("Doctors fetch error:", e);
    }
    const local = localStorage.getItem("clinic_doctors");
    const raw = local ? JSON.parse(local) : (fallback || DEFAULT_DOCTORS);
    return Array.isArray(raw) ? raw.map((d) => this.normalizeDoctor(d)) : DEFAULT_DOCTORS.map((d) => this.normalizeDoctor(d));
  },
  saveDoctorsLocal(data) {
    const normalized = Array.isArray(data) ? data.map((d) => this.normalizeDoctor(d)) : [];
    localStorage.setItem("clinic_doctors", JSON.stringify(normalized));
  },
  async createDoctor(data) {
    try {
      const res = await fetch(`${BASE_URL}/doctors`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const created = await res.json();
        return this.normalizeDoctor(created);
      }
      const errText = await res.text();
      console.error("Error creating doctor:", res.status, errText);
      alert(`Gagal menyimpan dokter ke Database (HTTP ${res.status}). Periksa koneksi database MySQL.`);
    } catch (e) {
      console.error("Error creating doctor:", e);
      alert("Koneksi gagal saat menyimpan data dokter ke database.");
    }
    return null;
  },
  async updateDoctor(id, data) {
    try {
      const res = await fetch(`${BASE_URL}/doctors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updated = await res.json();
        return this.normalizeDoctor(updated);
      }
      alert(`Gagal memperbarui data dokter di Database (HTTP ${res.status}).`);
    } catch (e) {
      console.error("Error updating doctor:", e);
    }
    return null;
  },
  async deleteDoctor(id) {
    try {
      const res = await fetch(`${BASE_URL}/doctors/${id}`, { method: "DELETE" });
      if (res.ok) return true;
      alert(`Gagal menghapus dokter dari Database (HTTP ${res.status}).`);
    } catch (e) {
      console.error("Error deleting doctor:", e);
    }
    return false;
  },

  // Queues
  async getQueues(fallback) {
    try {
      const res = await fetch(`${BASE_URL}/queues`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem("clinic_queues", JSON.stringify(data));
          return data;
        }
      } else {
        console.error("Fetch queues failed with status:", res.status);
      }
    } catch (e) {
      console.error("Queues fetch error:", e);
    }
    const local = localStorage.getItem("clinic_queues");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return fallback || DEFAULT_QUEUES;
  },
  saveQueuesLocal(data) {
    localStorage.setItem("clinic_queues", JSON.stringify(data));
  },
  async createQueue(data) {
    try {
      const res = await fetch(`${BASE_URL}/queues`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
      const errText = await res.text();
      console.error("Error creating queue:", res.status, errText);
      alert(`Gagal menyimpan antrean ke Database (HTTP ${res.status}). Periksa koneksi database MySQL.`);
    } catch (e) {
      console.error("Error creating queue:", e);
      alert("Koneksi gagal saat mendaftar antrean ke database.");
    }
    return null;
  },
  async updateQueue(id, data) {
    try {
      const res = await fetch(`${BASE_URL}/queues/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
      alert(`Gagal memperbarui status antrean di Database (HTTP ${res.status}).`);
    } catch (e) {
      console.error("Error updating queue:", e);
    }
    return null;
  },
  async deleteQueue(id) {
    try {
      const res = await fetch(`${BASE_URL}/queues/${id}`, { method: "DELETE" });
      if (res.ok) return true;
      alert(`Gagal menghapus antrean dari Database (HTTP ${res.status}).`);
    } catch (e) {
      console.error("Error deleting queue:", e);
    }
    return false;
  },

  // News
  async getNews(fallback) {
    try {
      const res = await fetch(`${BASE_URL}/news`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem("clinic_news", JSON.stringify(data));
          return data;
        }
      } else {
        console.error("Fetch news failed with status:", res.status);
      }
    } catch (e) {
      console.error("News fetch error:", e);
    }
    const local = localStorage.getItem("clinic_news");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return fallback || [];
  },
  saveNewsLocal(data) {
    localStorage.setItem("clinic_news", JSON.stringify(data));
  },
  async createNews(data) {
    try {
      const res = await fetch(`${BASE_URL}/news`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
      const errText = await res.text();
      console.error("Error creating news:", res.status, errText);
      alert(`Gagal menyimpan artikel ke Database (HTTP ${res.status}). Periksa koneksi database MySQL.`);
    } catch (e) {
      console.error("Error creating news:", e);
      alert("Koneksi gagal saat menyimpan artikel ke database.");
    }
    return null;
  },
  async updateNews(id, data) {
    try {
      const res = await fetch(`${BASE_URL}/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
      alert(`Gagal memperbarui artikel di Database (HTTP ${res.status}).`);
    } catch (e) {
      console.error("Error updating news:", e);
    }
    return null;
  },
  async deleteNews(id) {
    try {
      const res = await fetch(`${BASE_URL}/news/${id}`, { method: "DELETE" });
      if (res.ok) return true;
      alert(`Gagal menghapus artikel dari Database (HTTP ${res.status}).`);
    } catch (e) {
      console.error("Error deleting news:", e);
    }
    return false;
  },

  // FAQs
  async getFaqs(fallback) {
    try {
      const res = await fetch(`${BASE_URL}/faqs`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem("clinic_faqs", JSON.stringify(data));
          return data;
        }
      } else {
        console.error("Fetch faqs failed with status:", res.status);
      }
    } catch (e) {
      console.error("FAQs fetch error:", e);
    }
    const local = localStorage.getItem("clinic_faqs");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return fallback || [];
  },
  saveFaqsLocal(data) {
    localStorage.setItem("clinic_faqs", JSON.stringify(data));
  },
  async createFaq(data) {
    try {
      const res = await fetch(`${BASE_URL}/faqs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
      const errText = await res.text();
      console.error("Error creating faq:", res.status, errText);
      alert(`Gagal menyimpan FAQ ke Database (HTTP ${res.status}). Periksa koneksi database MySQL.`);
    } catch (e) {
      console.error("Error creating faq:", e);
      alert("Koneksi gagal saat menyimpan FAQ ke database.");
    }
    return null;
  },
  async updateFaq(id, data) {
    try {
      const res = await fetch(`${BASE_URL}/faqs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
      alert(`Gagal memperbarui FAQ di Database (HTTP ${res.status}).`);
    } catch (e) {
      console.error("Error updating faq:", e);
    }
    return null;
  },
  async deleteFaq(id) {
    try {
      const res = await fetch(`${BASE_URL}/faqs/${id}`, { method: "DELETE" });
      if (res.ok) return true;
      alert(`Gagal menghapus FAQ dari Database (HTTP ${res.status}).`);
    } catch (e) {
      console.error("Error deleting faq:", e);
    }
    return false;
  }
};
