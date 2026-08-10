import { useState } from "react";
import styles from "./Input.module.css";

export default function InputPassword({
  label,
  value,
  onChange,
  placeholder = "Masukkan password",
  name,
  id,
  error,
  ...props
}) {
  const [hide, setHide] = useState(true);

  const inputProps = {};
  if (value !== undefined) inputProps.value = value;
  if (onChange !== undefined) inputProps.onChange = onChange;

  return (
    <div className={styles.group}>
      {label && <label htmlFor={id || name} className={styles.label}>{label}</label>}
      <div className={`${styles.passwordWrapper} ${error ? styles.inputError : ""}`}>
        <input
          id={id || name}
          name={name}
          type={hide ? "password" : "text"}
          placeholder={placeholder}
          className={styles.passwordInput}
          {...inputProps}
          {...props}
        />
        <div className={styles.eyeButton} onClick={() => setHide(!hide)}>
          {hide ? "Lihat" : "Sembunyikan"}
        </div>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
