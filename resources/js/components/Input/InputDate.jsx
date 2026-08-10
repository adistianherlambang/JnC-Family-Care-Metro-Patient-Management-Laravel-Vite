import { useState } from "react";
import styles from "./Input.module.css";

export default function InputDate({
  label,
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  name,
  id,
  error,
  ...props
}) {
  const [internalValue, setInternalValue] = useState("");
  const currentValue = value !== undefined ? value : internalValue;

  const formatDate = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 8);
    let formatted = "";
    if (digits.length > 0) formatted += digits.slice(0, 2);
    if (digits.length >= 3) formatted += "/" + digits.slice(2, 4);
    if (digits.length >= 5) formatted += "/" + digits.slice(4, 8);
    return formatted;
  };

  const handleInputChange = (e) => {
    const rawVal = e.target.value;
    const formatted = formatDate(rawVal);
    setInternalValue(formatted);

    if (typeof onChange === "function") {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          name: name || id,
          value: formatted
        }
      };
      onChange(syntheticEvent, formatted);
    }
  };

  return (
    <div className={styles.group}>
      {label && <label htmlFor={id || name} className={styles.label}>{label}</label>}
      <div className={`${styles.dateWrapper} ${error ? styles.inputError : ""}`}>
        <input
          id={id || name}
          name={name}
          type="text"
          value={currentValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          maxLength={10}
          className={styles.dateInput}
          {...props}
        />
        <div className={styles.dateIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
