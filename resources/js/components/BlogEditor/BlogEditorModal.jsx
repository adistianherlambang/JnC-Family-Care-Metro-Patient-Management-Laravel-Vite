import React, { useState, useEffect } from "react";
import styles from "./BlogEditorModal.module.css";
import Button from "../Button/Button";
import InputText from "../Input/InputText";
import InputSelect from "../Input/InputSelect";

export default function BlogEditorModal({ isOpen, onClose, onSave, initialData }) {
  const [activeTab, setActiveTab] = useState("editor"); // 'editor' | 'preview'
  const [formData, setFormData] = useState({
    title: "",
    category: "Kesehatan Anak",
    author: "dr. Aulia Rahma, Sp.A",
    readTime: "3 min read",
    image: "",
    summary: "",
    content: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        category: initialData.category || "Kesehatan Anak",
        author: initialData.author || "dr. Aulia Rahma, Sp.A",
        readTime: initialData.readTime || initialData.read_time || "3 min read",
        image: initialData.image || "",
        summary: initialData.summary || "",
        content: initialData.content || "",
      });
    } else {
      setFormData({
        title: "",
        category: "Kesehatan Anak",
        author: "dr. Aulia Rahma, Sp.A",
        readTime: "3 min read",
        image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80",
        summary: "",
        content: "",
      });
    }
    setActiveTab("editor");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleToolbarInsert = (prefix, suffix = "") => {
    const textarea = document.getElementById("blogContentTextArea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = formData.content;
    const selectedText = currentText.substring(start, end) || "teks di sini";
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent =
      currentText.substring(0, start) + replacement + currentText.substring(end);

    setFormData((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 50);
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert("Judul artikel wajib diisi!");
      return;
    }
    if (!formData.summary.trim()) {
      alert("Ringkasan singkat artikel wajib diisi!");
      return;
    }
    onSave(formData);
  };

  // Basic renderer for Live Preview tab
  const renderFormattedContent = (rawText) => {
    if (!rawText) return <p className={styles.emptyPreview}>Belum ada isi artikel. Tulis di tab Editor.</p>;

    const paragraphs = rawText.split("\n\n");
    return paragraphs.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith("## ")) {
        return <h2 key={idx} className={styles.previewH2}>{trimmed.replace("## ", "")}</h2>;
      }
      if (trimmed.startsWith("### ")) {
        return <h3 key={idx} className={styles.previewH3}>{trimmed.replace("### ", "")}</h3>;
      }
      if (trimmed.startsWith("> ")) {
        return (
          <blockquote key={idx} className={styles.previewQuote}>
            {trimmed.replace("> ", "")}
          </blockquote>
        );
      }
      if (trimmed.startsWith("💡 ")) {
        return (
          <div key={idx} className={styles.previewCallout}>
            <span className={styles.calloutIcon}>💡</span>
            <div>{trimmed.replace("💡 ", "")}</div>
          </div>
        );
      }
      if (trimmed.startsWith("• ") || trimmed.startsWith("- ")) {
        const items = trimmed.split("\n").map((i) => i.replace(/^[•\-]\s*/, ""));
        return (
          <ul key={idx} className={styles.previewUl}>
            {items.map((it, iIdx) => (
              <li key={iIdx}>{it}</li>
            ))}
          </ul>
        );
      }

      return (
        <p key={idx} className={styles.previewParagraph}>
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>
              {initialData ? "Edit Artikel Blog" : "Buat Artikel Blog Baru"}
            </h3>
            <p className={styles.modalSubtitle}>
              Tulis dan publikasikan edukasi kesehatan ibu dan anak dalam format artikel panjang.
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className={styles.tabBar}>
          <button
            className={`${styles.tabBtn} ${activeTab === "editor" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("editor")}
          >
            ✏️ Editor Artikel
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "preview" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("preview")}
          >
            👁️ Prinjau Tampilan Artikel
          </button>
        </div>

        <div className={styles.modalBody}>
          {activeTab === "editor" ? (
            <div className={styles.editorForm}>
              <div className={styles.rowTwoCols}>
                <InputText
                  label="Judul Utama Artikel"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Panduan Lengkap Nutrisi MPASI Pertama Bayi"
                />
                <InputSelect
                  label="Kategori Artikel"
                  options={[
                    "Kesehatan Anak",
                    "Kehamilan & Persalinan",
                    "Nutrisi & Imunisasi",
                    "Mom & Baby Care",
                    "Tumbuh Kembang",
                  ]}
                  value={formData.category}
                  onChange={(val) => setFormData({ ...formData, category: val })}
                />
              </div>

              <div className={styles.rowThreeCols}>
                <InputText
                  label="Penulis / Dokter"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Contoh: dr. Aulia Rahma, Sp.A"
                />
                <InputText
                  label="Estimasi Waktu Baca"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  placeholder="Contoh: 4 min read"
                />
                <InputText
                  label="URL Gambar Sampul (Cover Image)"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <InputText
                label="Ringkasan Singkat (Excerpt)"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Ringkasan 1-2 kalimat yang tampil pada kartu beranda pasien..."
              />

              {/* Rich Content Editor Section */}
              <div className={styles.editorSection}>
                <label className={styles.sectionLabel}>Isi Artikel Blog Lengkap</label>
                
                {/* Toolbar */}
                <div className={styles.toolbar}>
                  <button
                    type="button"
                    className={styles.toolBtn}
                    onClick={() => handleToolbarInsert("## ")}
                    title="Subjudul H2"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    className={styles.toolBtn}
                    onClick={() => handleToolbarInsert("### ")}
                    title="Subjudul H3"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    className={styles.toolBtn}
                    onClick={() => handleToolbarInsert("**", "**")}
                    title="Cetak Tebal"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    className={styles.toolBtn}
                    onClick={() => handleToolbarInsert("*", "*")}
                    title="Cetak Miring"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    className={styles.toolBtn}
                    onClick={() => handleToolbarInsert("• ")}
                    title="Daftar Bullet"
                  >
                    • List
                  </button>
                  <button
                    type="button"
                    className={styles.toolBtn}
                    onClick={() => handleToolbarInsert("> ")}
                    title="Kutipan/Quote"
                  >
                    Quote
                  </button>
                  <button
                    type="button"
                    className={styles.toolBtn}
                    onClick={() => handleToolbarInsert("💡 Tips Medis: ")}
                    title="Kotak Tips Medis"
                  >
                    💡 Tips
                  </button>
                </div>

                <textarea
                  id="blogContentTextArea"
                  className={styles.textarea}
                  rows={12}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tuliskan isi artikel blog secara mendalam di sini... Gunakan toolbar di atas untuk format teks, subjudul, poin penting, dan tips medis."
                />
              </div>
            </div>
          ) : (
            /* Live Preview Container */
            <div className={styles.previewContainer}>
              <div className={styles.articleCardHeader}>
                <span className={styles.categoryPill}>{formData.category}</span>
                <h1 className={styles.previewTitle}>{formData.title || "Judul Artikel Blog"}</h1>
                <div className={styles.articleMeta}>
                  <span>✍️ {formData.author || "Tim Redaksi"}</span>
                  <span>•</span>
                  <span>⏱️ {formData.readTime || "3 min read"}</span>
                </div>
              </div>

              {formData.image && (
                <div className={styles.previewCoverWrapper}>
                  <img
                    src={formData.image}
                    alt="Cover"
                    className={styles.previewCoverImg}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80";
                    }}
                  />
                </div>
              )}

              {formData.summary && (
                <div className={styles.previewLeadSummary}>
                  {formData.summary}
                </div>
              )}

              <div className={styles.previewBody}>
                {renderFormattedContent(formData.content)}
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSave}>
            {initialData ? "Simpan Perubahan Artikel" : "Publikasikan Artikel"}
          </Button>
        </div>
      </div>
    </div>
  );
}
