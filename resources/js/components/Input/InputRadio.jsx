import { useState } from "react";
import styles from "./Input.module.css";

export default function InputRadio({
  label,
  options = [],
  value,
  onChange,
  name,
  error
}) {
  const [internalValue, setInternalValue] = useState("");
  const currentValue = value !== undefined ? value : internalValue;

  const getOptionLabel = (opt) => (typeof opt === "object" ? opt.label : opt);
  const getOptionValue = (opt) => (typeof opt === "object" ? opt.value : opt);

  const handleSelect = (val) => {
    setInternalValue(val);
    if (typeof onChange === "function") {
      onChange(val);
    }
  };

  return (
    <div className={styles.group}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.radioGroup}>
        {options.map((opt, index) => {
          const optVal = getOptionValue(opt);
          const optLbl = getOptionLabel(opt);
          const isSelected = currentValue === optVal;
          return (
            <div
              key={index}
              className={`${styles.radioCard} ${isSelected ? styles.radioCardActive : ""} ${error ? styles.inputError : ""}`}
              onClick={() => handleSelect(optVal)}
            >
              <div className={styles.radioCircle}>
                {isSelected && <div className={styles.radioDot} />}
              </div>
              <span>{optLbl}</span>
            </div>
          );
        })}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
