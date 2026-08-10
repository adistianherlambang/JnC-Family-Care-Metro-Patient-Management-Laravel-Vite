const BASE_URL = "/api";

export const apiService = {
  // Categories
  async getCategories(fallback) {
    try {
      const res = await fetch(`${BASE_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      console.warn("MySQL API fetch error:", e);
    }
    return fallback;
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
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      console.warn("MySQL API fetch error:", e);
    }
    return fallback;
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
    return fallback;
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
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      console.warn("MySQL API fetch error:", e);
    }
    return fallback;
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
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      console.warn("MySQL API fetch error:", e);
    }
    return fallback;
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
