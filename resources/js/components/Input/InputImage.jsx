import { useState, useRef } from "react";
import styles from "./Input.module.css";

export default function InputImage({
  label,
  value,
  onChange,
  accept = "image/*",
  placeholder = "Klik atau seret gambar ke sini untuk mengunggah",
  error,
  id,
  name,
  ...props
}) {
  const [internalPreview, setInternalPreview] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const currentPreview =
    typeof value === "string" && value.length > 0
      ? value
      : internalPreview;

  const handleFileChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setInternalPreview(compressedDataUrl);

        if (typeof onChange === "function") {
          onChange(file, compressedDataUrl);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFileChange(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setInternalPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (typeof onChange === "function") {
      onChange(null, "");
    }
  };

  return (
    <div className={styles.group}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={`${styles.imageUploadArea} ${isDragOver ? styles.imageUploadDragOver : ""} ${error ? styles.inputError : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          id={id || name}
          name={name}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className={styles.hiddenFileInput}
          {...props}
        />

        {currentPreview ? (
          <div className={styles.imagePreviewWrapper} onClick={handleRemove}>
            <img src={currentPreview} alt="Upload preview" className={styles.imagePreview} />
          </div>
        ) : (
          <div className={styles.imagePlaceholderContent}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="#D896ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className={styles.imageUploadText}>{placeholder}</p>
            <span className={styles.imageUploadSubtext}>PNG, JPG, JPEG (Maksimal 5MB)</span>
          </div>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
