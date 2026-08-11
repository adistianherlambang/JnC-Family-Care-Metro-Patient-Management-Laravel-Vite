import React from "react";
import styles from "./Button.module.css";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary", // 'primary', 'secondary', 'outline', 'danger'
  size = "md", // 'sm', 'md', 'lg'
  fullWidth = false,
  disabled = false,
  icon = null,
  className = "",
  style = {},
  ...props
}) {
  const variantClass = styles[variant] || styles.primary;
  const sizeClass = styles[size === "sm" ? "sizeSm" : size === "lg" ? "sizeLg" : "sizeMd"];
  const widthClass = fullWidth ? styles.fullWidth : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.btn} ${variantClass} ${sizeClass} ${widthClass} ${className}`.trim()}
      style={style}
      {...props}
    >
      {icon && <span style={{ display: "inline-flex", alignItems: "center" }}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
