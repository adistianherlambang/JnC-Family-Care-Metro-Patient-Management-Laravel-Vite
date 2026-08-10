import styles from "./Input.module.css";

export default function InputText({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  name,
  id,
  error,
  ...props
}) {
  const inputProps = {};
  if (value !== undefined) inputProps.value = value;
  if (onChange !== undefined) inputProps.onChange = onChange;

  return (
    <div className={styles.group}>
      {label && <label htmlFor={id || name} className={styles.label}>{label}</label>}
      <input
        id={id || name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        {...inputProps}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
