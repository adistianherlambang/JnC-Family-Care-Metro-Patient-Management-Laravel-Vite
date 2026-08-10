import { useState, useEffect, useRef } from "react";
import styles from "./Input.module.css";

export default function InputSelect({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Pilih...",
  error,
  id,
  name
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState("");
  const dropdownRef = useRef(null);

  const currentValue = value !== undefined ? value : internalValue;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    setInternalValue(optionValue);
    if (typeof onChange === "function") {
      onChange(optionValue);
    }
    setIsOpen(false);
  };

  const getOptionLabel = (opt) => (typeof opt === "object" ? opt.label : opt);
  const getOptionValue = (opt) => (typeof opt === "object" ? opt.value : opt);

  const selectedDisplayLabel = () => {
    if (!currentValue) return null;
    const found = options.find((opt) => getOptionValue(opt) === currentValue);
    return found ? getOptionLabel(found) : currentValue;
  };

  return (
    <div className={styles.group}>
      {label && <label htmlFor={id || name} className={styles.label}>{label}</label>}
      <div className={styles.selectWrapper} ref={dropdownRef}>
        <div
          className={`${styles.selectTrigger} ${isOpen ? styles.selectOpen : ""} ${error ? styles.inputError : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={currentValue ? styles.selectedValue : styles.placeholder}>
            {selectedDisplayLabel() || placeholder}
          </span>
          <svg
            className={`${styles.selectArrow} ${isOpen ? styles.arrowRotate : ""}`}
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 1.5L6 6.5L11 1.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {isOpen && (
          <div className={styles.selectMenu}>
            {options.map((opt, index) => {
              const optVal = getOptionValue(opt);
              const optLbl = getOptionLabel(opt);
              const isSelected = currentValue === optVal;
              return (
                <div
                  key={index}
                  className={`${styles.selectItem} ${isSelected ? styles.selectActiveItem : ""}`}
                  onClick={() => handleSelect(optVal)}
                >
                  {optLbl}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
