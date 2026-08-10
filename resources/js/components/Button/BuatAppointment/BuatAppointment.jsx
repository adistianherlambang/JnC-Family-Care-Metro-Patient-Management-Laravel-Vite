import { useNavigate } from "react-router-dom";
import styles from "./BuatAppointment.module.css";

export default function BuatAppointment({ color = "primary" }) {
  const navigate = useNavigate();
  const handleBuatAppointment = () => {
    navigate("/appointment");
  };

  return (
    <div className={`${styles.container} ${color === "primary" ? styles.primary : styles.secondary}`} onClick={handleBuatAppointment}>
      <p>Buat Appointment</p>
      <div className={styles.iconContainer} style={{ backgroundColor: color == "primary" ? "white" : "#D896ED" }}>
        <svg width="27" height="23" viewBox="0 0 27 23" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.5 9.5459H0V12.5459H1.5V11.0459V9.5459ZM26.5607 12.1066C27.1464 11.5208 27.1464 10.571 26.5607 9.98524L17.0147 0.439297C16.4289 -0.14649 15.4792 -0.14649 14.8934 0.439297C14.3076 1.02508 14.3076 1.97483 14.8934 2.56062L23.3787 11.0459L14.8934 19.5312C14.3076 20.117 14.3076 21.0667 14.8934 21.6525C15.4792 22.2383 16.4289 22.2383 17.0147 21.6525L26.5607 12.1066ZM1.5 11.0459V12.5459H25.5V11.0459V9.5459H1.5V11.0459Z" fill={color === "primary" ? "black" : "white"} />
        </svg>
      </div>
    </div>
  );
}