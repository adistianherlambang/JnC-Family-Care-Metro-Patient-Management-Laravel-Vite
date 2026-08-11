import React from "react";
import styles from "./BlogReaderModal.module.css";
import Button from "../Button/Button";

export default function BlogReaderModal({ isOpen, onClose, article }) {
  if (!isOpen || !article) return null;

  const renderContent = (rawText) => {
    if (!rawText) return <p className={styles.noContent}>Isi artikel tidak tersedia.</p>;

    if (rawText.includes("<p>") || rawText.includes("<h2>") || rawText.includes("<div") || rawText.includes("<ul")) {
      return <div dangerouslySetInnerHTML={{ __html: rawText }} />;
    }

    const blocks = rawText.split("\n\n");
    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith("## ")) {
        return <h2 key={idx} className={styles.heading2}>{trimmed.replace("## ", "")}</h2>;
      }
      if (trimmed.startsWith("### ")) {
        return <h3 key={idx} className={styles.heading3}>{trimmed.replace("### ", "")}</h3>;
      }
      if (trimmed.startsWith("> ")) {
        return (
          <blockquote key={idx} className={styles.quoteBlock}>
            {trimmed.replace("> ", "")}
          </blockquote>
        );
      }
      if (trimmed.startsWith("💡 ")) {
        return (
          <div key={idx} className={styles.calloutBox}>
            <span className={styles.calloutIcon}>💡</span>
            <div>{trimmed.replace("💡 ", "")}</div>
          </div>
        );
      }
      if (trimmed.startsWith("• ") || trimmed.startsWith("- ")) {
        const items = trimmed.split("\n").map((i) => i.replace(/^[•\-]\s*/, ""));
        return (
          <ul key={idx} className={styles.bulletList}>
            {items.map((it, iIdx) => (
              <li key={iIdx}>{it}</li>
            ))}
          </ul>
        );
      }

      return (
        <p key={idx} className={styles.paragraph}>
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Cover Image Header */}
        <div className={styles.headerImageWrapper}>
          <img
            src={
              article.image ||
              "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80"
            }
            alt={article.title}
            className={styles.headerImage}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80";
            }}
          />
          <button className={styles.closeFloatingBtn} onClick={onClose} title="Tutup">
            ✕
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className={styles.modalContent}>
          <div className={styles.metaRow}>
            <span className={styles.categoryBadge}>{article.category}</span>
            <span className={styles.readTime}>⏱️ {article.readTime || article.read_time || "3 min read"}</span>
          </div>

          <h1 className={styles.articleTitle}>{article.title}</h1>

          <div className={styles.authorBar}>
            <div className={styles.authorAvatar}>
              {(article.author || "R")[0]}
            </div>
            <div>
              <p className={styles.authorName}>{article.author || "Tim Redaksi Meika Healthcare"}</p>
              <p className={styles.publishDate}>{article.date || "Terbaru"}</p>
            </div>
          </div>

          {article.summary && (
            <div className={styles.leadSummary}>
              {article.summary}
            </div>
          )}

          <div className={styles.articleBody}>
            {renderContent(article.content)}
          </div>
        </div>

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <Button onClick={onClose}>
            Selesai Membaca
          </Button>
        </div>
      </div>
    </div>
  );
}
