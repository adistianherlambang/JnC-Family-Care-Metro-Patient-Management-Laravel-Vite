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

export const apiService = {
  // Categories
  async getCategories(fallback) {
    try {
      const res = await fetch(`${BASE_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn("MySQL API fetch error:", e);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Error creating category:", e);
    }
    return null;
  },
  async updateCategory(id, data) {
    try {
      const res = await fetch(`${BASE_URL}/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Error updating category:", e);
    }
    return null;
  },
  async deleteCategory(id) {
    try {
      await fetch(`${BASE_URL}/categories/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Error deleting category:", e);
    }
  },

  // Doctors
  async getDoctors(fallback) {
    try {
      const res = await fetch(`${BASE_URL}/doctors`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn("MySQL API fetch error:", e);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Error creating doctor:", e);
    }
    return null;
  },
  async updateDoctor(id, data) {
    try {
      const res = await fetch(`${BASE_URL}/doctors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Error updating doctor:", e);
    }
    return null;
  },
  async deleteDoctor(id) {
    try {
      await fetch(`${BASE_URL}/doctors/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Error deleting doctor:", e);
    }
  },

  // Queues
  async getQueues(fallback) {
    try {
      const res = await fetch(`${BASE_URL}/queues`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      console.warn("MySQL API fetch error:", e);
    }
    const local = localStorage.getItem("clinic_queues");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const isStaleLiteral = parsed.some((q) => q.date === "Hari Ini" || q.date === "Besok");
          if (!isStaleLiteral) {
            return parsed;
          }
        }
      } catch (e) {}
    }
    localStorage.setItem("clinic_queues", JSON.stringify(DEFAULT_QUEUES));
    return DEFAULT_QUEUES;
  },
  saveQueuesLocal(data) {
    localStorage.setItem("clinic_queues", JSON.stringify(data));
  },
  async createQueue(data) {
    try {
      const res = await fetch(`${BASE_URL}/queues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Error creating queue:", e);
    }
    return null;
  },
  async updateQueue(id, data) {
    try {
      const res = await fetch(`${BASE_URL}/queues/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Error updating queue:", e);
    }
    return null;
  },
  async deleteQueue(id) {
    try {
      await fetch(`${BASE_URL}/queues/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Error deleting queue:", e);
    }
  },

  // News
  async getNews(fallback) {
    try {
      const res = await fetch(`${BASE_URL}/news`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn("MySQL API fetch error:", e);
    }
    const local = localStorage.getItem("clinic_news");
    return local ? JSON.parse(local) : (fallback || []);
  },
  saveNewsLocal(data) {
    localStorage.setItem("clinic_news", JSON.stringify(data));
  },
  async createNews(data) {
    try {
      const res = await fetch(`${BASE_URL}/news`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Error creating news:", e);
    }
    return null;
  },
  async updateNews(id, data) {
    try {
      const res = await fetch(`${BASE_URL}/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Error updating news:", e);
    }
    return null;
  },
  async deleteNews(id) {
    try {
      await fetch(`${BASE_URL}/news/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Error deleting news:", e);
    }
  },

  // FAQs
  async getFaqs(fallback) {
    try {
      const res = await fetch(`${BASE_URL}/faqs`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn("MySQL API fetch error:", e);
    }
    const local = localStorage.getItem("clinic_faqs");
    return local ? JSON.parse(local) : (fallback || []);
  },
  saveFaqsLocal(data) {
    localStorage.setItem("clinic_faqs", JSON.stringify(data));
  },
  async createFaq(data) {
    try {
      const res = await fetch(`${BASE_URL}/faqs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Error creating faq:", e);
    }
    return null;
  },
  async updateFaq(id, data) {
    try {
      const res = await fetch(`${BASE_URL}/faqs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Error updating faq:", e);
    }
    return null;
  },
  async deleteFaq(id) {
    try {
      await fetch(`${BASE_URL}/faqs/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Error deleting faq:", e);
    }
  }
};
