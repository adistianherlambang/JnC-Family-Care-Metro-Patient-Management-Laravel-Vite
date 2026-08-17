import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout({
  menuItems = [],
  activeMenu,
  onMenuChange,
  userInfo = { title: "", subtitle: "", badge: "" },
  onLogout,
  children
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("loggedInUser");
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.thirdContainer}>
        {/* Sidebar Menu */}
        <aside className={styles.menuWrapper}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="Logo" />
          </div>
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`${styles.menuItem} ${activeMenu === item.id ? styles.menuItemActive : ""}`}
              onClick={() => onMenuChange && onMenuChange(item.id)}
            >
              {item.svg}
              {item.label}
            </div>
          ))}
          <div className={styles.menuItem} onClick={handleLogout}>
            <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.1429 0H0.857143C0.629814 0 0.411797 0.0842854 0.251051 0.234315C0.090306 0.384344 0 0.587827 0 0.8V8L4.28571 4.8V7.2H9.42857V8.8H4.28571V11.2L0 8V15.2C0 15.4122 0.090306 15.6157 0.251051 15.7657C0.411797 15.9157 0.629814 16 0.857143 16H11.1429C11.3702 16 11.5882 15.9157 11.7489 15.7657C11.9097 15.6157 12 15.4122 12 15.2V0.8C12 0.587827 11.9097 0.384344 11.7489 0.234315C11.5882 0.0842854 11.3702 0 11.1429 0Z" fill="currentColor" />
            </svg>
            Keluar
          </div>
        </aside>

        {/* Main Content Wrapper */}
        <div className={styles.rightWrapper}>
          {/* Top Navbar */}
          <header className={styles.nav}>
            <div className={styles.userInfoWrapper}>
              <div className={styles.confirm}>
                <p className={styles.label}>
                  {userInfo.title}
                  {userInfo.badge && <span className={styles.badgeRole}>{userInfo.badge}</span>}
                </p>
                {userInfo.subtitle && <p className={styles.value}>{userInfo.subtitle}</p>}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className={styles.content}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
