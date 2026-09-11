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
    return local ? JSON.parse(local) : (fallback || []);
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
  async getDoctors(fallback) {
    try {
      const res = await fetch(`${BASE_URL}/doctors`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem("clinic_doctors", JSON.stringify(data));
          return data;
        }
      } else {
        console.error("Fetch doctors failed with status:", res.status);
      }
    } catch (e) {
      console.error("Doctors fetch error:", e);
    }
    const local = localStorage.getItem("clinic_doctors");
    return local ? JSON.parse(local) : (fallback || []);
  },
  saveDoctorsLocal(data) {
    localStorage.setItem("clinic_doctors", JSON.stringify(data));
  },
  async createDoctor(data) {
    try {
      const res = await fetch(`${BASE_URL}/doctors`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
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
      if (res.ok) return await res.json();
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
