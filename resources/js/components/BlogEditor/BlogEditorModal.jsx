import React, { useState, useEffect, useRef } from "react";
import styles from "./BlogEditorModal.module.css";
import Button from "../Button/Button";
import InputText from "../Input/InputText";
import InputSelect from "../Input/InputSelect";
import InputImage from "../Input/InputImage";
import Modal from "../Modal/Modal";

export default function BlogEditorModal({ isOpen, onClose, onSave, initialData }) {
  const [activeTab, setActiveTab] = useState("editor"); // 'editor' | 'preview'
  const editorRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Kesehatan Anak",
    author: "dr. Aulia Rahma, Sp.A",
    readTime: "3 min read",
    image: "",
    summary: "",
    content: "",
  });

  const convertRawToHtml = (str) => {
    if (!str) return "<p>Tuliskan isi artikel blog secara mendalam di sini...</p>";
    if (str.includes("<p>") || str.includes("<h2>") || str.includes("<div")) return str;
    return str
      .split("\n\n")
      .map((b) => {
        const trimmed = b.trim();
        if (!trimmed) return "";
        if (trimmed.startsWith("## ")) return `<h2>${trimmed.replace("## ", "")}</h2>`;
        if (trimmed.startsWith("### ")) return `<h3>${trimmed.replace("### ", "")}</h3>`;
        if (trimmed.startsWith("> ")) return `<blockquote>${trimmed.replace("> ", "")}</blockquote>`;
        if (trimmed.startsWith("💡 ")) return `<div class="calloutBox">💡 ${trimmed.replace("💡 ", "")}</div>`;
        if (trimmed.startsWith("• ") || trimmed.startsWith("- ")) {
          const lis = trimmed.split("\n").map((i) => `<li>${i.replace(/^[•\-]\s*/, "")}</li>`).join("");
          return `<ul>${lis}</ul>`;
        }
        return `<p>${trimmed}</p>`;
      })
      .join("");
  };

  useEffect(() => {
    if (initialData) {
      const htmlContent = convertRawToHtml(initialData.content || "");
      setFormData({
        title: initialData.title || "",
        category: initialData.category || "Kesehatan Anak",
        author: initialData.author || "dr. Aulia Rahma, Sp.A",
        readTime: initialData.readTime || initialData.read_time || "3 min read",
        image: initialData.image || "",
        summary: initialData.summary || "",
        content: htmlContent,
      });
      if (editorRef.current) {
        editorRef.current.innerHTML = htmlContent;
      }
    } else {
      const defaultHtml = "<p>Tuliskan isi artikel blog secara mendalam di sini...</p>";
      setFormData({
        title: "",
        category: "Kesehatan Anak",
        author: "dr. Aulia Rahma, Sp.A",
        readTime: "3 min read",
        image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80",
        summary: "",
        content: defaultHtml,
      });
      if (editorRef.current) {
        editorRef.current.innerHTML = defaultHtml;
      }
    }
    setActiveTab("editor");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleWysiwygInput = () => {
    if (editorRef.current) {
      setFormData((prev) => ({ ...prev, content: editorRef.current.innerHTML }));
    }
  };

  const execCmd = (command, value = null) => {
    document.execCommand(command, false, value);
    handleWysiwygInput();
  };

  const insertCustomBlock = (type) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    if (type === "h2") {
      execCmd("formatBlock", "<h2>");
    } else if (type === "h3") {
      execCmd("formatBlock", "<h3>");
    } else if (type === "p") {
      execCmd("formatBlock", "<p>");
    } else if (type === "quote") {
      const sel = window.getSelection().toString() || "Kutipan penting di sini...";
      execCmd("insertHTML", `<blockquote>${sel}</blockquote><p><br></p>`);
    } else if (type === "tips") {
      const sel = window.getSelection().toString() || "Tips Medis: Konsultasikan dengan dokter spesialis.";
      execCmd("insertHTML", `<div class="calloutBox">💡 <div>${sel}</div></div><p><br></p>`);
    } else if (type === "bullet") {
      execCmd("insertUnorderedList");
    }
  };

  const handleSave = () => {
    const currentHtml = editorRef.current ? editorRef.current.innerHTML : formData.content;
    const finalData = { ...formData, content: currentHtml };

    if (!finalData.title.trim()) {
      alert("Judul artikel wajib diisi!");
      return;
    }
    if (!finalData.summary.trim()) {
      alert("Ringkasan singkat artikel wajib diisi!");
      return;
    }
    onSave(finalData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Artikel Blog" : "Buat Artikel Blog Baru"}
      subtitle="Tulis dan publikasikan edukasi kesehatan ibu dan anak dalam format artikel panjang."
      maxWidth="850px"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSave}>
            {initialData ? "Simpan Perubahan Artikel" : "Publikasikan Artikel"}
          </Button>
        </>
      }
    >
      {/* Tab Switcher */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === "editor" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("editor")}
        >
          Live Rich Editor
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "preview" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("preview")}
        >
          Pratinjau Tampilan Pasien
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

            <div className={styles.rowTwoCols}>
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
            </div>

            <InputImage
              label="Unggah Foto Sampul Artikel (Cover Image)"
              value={formData.image}
              onChange={(file, preview) => setFormData({ ...formData, image: preview })}
              placeholder="Klik atau seret berkas gambar sampul artikel ke sini untuk mengunggah (PNG, JPG, JPEG)"
            />

            <InputText
              label="Ringkasan Singkat (Excerpt)"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Ringkasan 1-2 kalimat yang tampil pada kartu beranda pasien..."
            />

            {/* WYSIWYG Visual Content Editor */}
            <div className={styles.editorSection}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className={styles.sectionLabel}>Isi Artikel Blog Lengkap (Pratinjau Visual Langsung)</label>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>Editor WYSIWYG Langsung</span>
              </div>

              {/* Visual Toolbar */}
              <div className={styles.toolbar}>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => insertCustomBlock("h2")}
                  title="Subjudul H2"
                >
                  H2 Subjudul
                </button>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => insertCustomBlock("h3")}
                  title="Subjudul H3"
                >
                  H3 Subjudul
                </button>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => execCmd("bold")}
                  title="Cetak Tebal"
                >
                  <strong>B Tebal</strong>
                </button>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => execCmd("italic")}
                  title="Cetak Miring"
                >
                  <em>I Miring</em>
                </button>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => insertCustomBlock("bullet")}
                  title="Daftar Poin"
                >
                  • List Poin
                </button>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => insertCustomBlock("quote")}
                  title="Kotak Kutipan"
                >
                  ” Quote
                </button>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => insertCustomBlock("tips")}
                  title="Kotak Tips Medis"
                >
                  💡 Tips Medis
                </button>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => insertCustomBlock("p")}
                  title="Paragraf Normal"
                >
                  Paragraf
                </button>
              </div>

              {/* ContentEditable Live Visual Editor Box */}
              <div
                ref={editorRef}
                className={styles.wysiwygEditor}
                contentEditable
                suppressContentEditableWarning
                onInput={handleWysiwygInput}
                onBlur={handleWysiwygInput}
              />
            </div>
          </div>
        ) : (
          /* Patient Reader Preview */
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

            <div
              className={styles.previewBody}
              dangerouslySetInnerHTML={{ __html: formData.content }}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
