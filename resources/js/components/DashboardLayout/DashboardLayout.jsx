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
