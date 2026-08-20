import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout({
  menuItems = [],
  activeMenu,
  onMenuChange,
  userInfo = { title: "", subtitle: "", badge: "", avatar: "", image: "" },
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

  const renderAvatar = () => {
    const avatarSrc = userInfo.avatar || userInfo.image;

    // 1. If valid image URL or image File object
    if (
      avatarSrc &&
      (typeof avatarSrc === "string"
        ? avatarSrc.startsWith("http") || avatarSrc.startsWith("/") || avatarSrc.startsWith("data:") || avatarSrc.startsWith("blob:")
        : avatarSrc instanceof File || avatarSrc instanceof Blob)
    ) {
      const srcUrl = typeof avatarSrc === "string" ? avatarSrc : URL.createObjectURL(avatarSrc);
      return <img src={srcUrl} alt={userInfo.title || "Avatar"} className={styles.avatarImage} />;
    }

    // 2. If explicit initials string passed (e.g., "A", "TS", "SR")
    if (typeof avatarSrc === "string" && avatarSrc.trim().length > 0 && avatarSrc.trim().length <= 3 && !avatarSrc.includes(" ")) {
      return <div className={styles.avatarInitials}>{avatarSrc.trim().toUpperCase()}</div>;
    }

    // 3. Compute initials from title (first letter of 1st word & 2nd word)
    let nameToParse = userInfo.title || "";
    // Clean common doctor/bidan prefixes
    nameToParse = nameToParse.replace(/^(Bidan|dr\.|drg\.|Dokter)\s+/i, "").trim();
    // Remove degree suffixes after comma
    if (nameToParse.includes(",")) {
      nameToParse = nameToParse.split(",")[0].trim();
    }

    const words = nameToParse.split(/\s+/).filter(Boolean);
    let initials = "U";
    if (words.length >= 2) {
      initials = (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1) {
      initials = words[0].substring(0, 2).toUpperCase();
    }

    return <div className={styles.avatarInitials}>{initials}</div>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.thirdContainer}>
        {/* Sidebar Menu (Desktop) */}
        <aside className={styles.menuWrapper}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="Logo" />
          </div>
          <div className={styles.menuListScroll}>
            {menuItems.map((item) => (
              <div
                key={item.id}
                className={`${styles.menuItem} ${activeMenu === item.id ? styles.menuItemActive : ""}`}
                onClick={() => onMenuChange && onMenuChange(item.id)}
              >
                {item.svg}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className={styles.menuItemLogout} onClick={handleLogout}>
            <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.1429 0H0.857143C0.629814 0 0.411797 0.0842854 0.251051 0.234315C0.090306 0.384344 0 0.587827 0 0.8V8L4.28571 4.8V7.2H9.42857V8.8H4.28571V11.2L0 8V15.2C0 15.4122 0.090306 15.6157 0.251051 15.7657C0.411797 15.9157 0.629814 16 0.857143 16H11.1429C11.3702 16 11.5882 15.9157 11.7489 15.7657C11.9097 15.6157 12 15.4122 12 15.2V0.8C12 0.587827 11.9097 0.384344 11.7489 0.234315C11.5882 0.0842854 11.3702 0 11.1429 0Z" fill="currentColor" />
            </svg>
            <span>Keluar</span>
          </div>
        </aside>

        {/* Main Content Wrapper */}
        <div className={styles.rightWrapper}>
          {/* Top Navbar Header */}
          <header className={styles.nav}>
            <div className={styles.mobileHeaderLogo}>
              <img src="/logo.png" alt="Logo" />
            </div>
            <div className={styles.userInfoWrapper}>
              <div className={styles.avatarContainer}>
                {renderAvatar()}
              </div>
              <div className={styles.userTextWrapper}>
                <p className={styles.userTitle}>
                  {userInfo.title}
                  {userInfo.badge && <span className={styles.badgeRole}>{userInfo.badge}</span>}
                </p>
                {userInfo.subtitle && <p className={styles.userSubtitle}>{userInfo.subtitle}</p>}
              </div>
              <div className={styles.mobileLogoutBtn} onClick={handleLogout} title="Keluar">
                <svg width="14" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.1429 0H0.857143C0.629814 0 0.411797 0.0842854 0.251051 0.234315C0.090306 0.384344 0 0.587827 0 0.8V8L4.28571 4.8V7.2H9.42857V8.8H4.28571V11.2L0 8V15.2C0 15.4122 0.090306 15.6157 0.251051 15.7657C0.411797 15.9157 0.629814 16 0.857143 16H11.1429C11.3702 16 11.5882 15.9157 11.7489 15.7657C11.9097 15.6157 12 15.4122 12 15.2V0.8C12 0.587827 11.9097 0.384344 11.7489 0.234315C11.5882 0.0842854 11.3702 0 11.1429 0Z" fill="currentColor" />
                </svg>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className={styles.content}>
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Bottom App Navigation Bar */}
      <nav className={styles.mobileBottomNav}>
        <div className={styles.mobileBottomNavInner}>
          {menuItems.map((item) => {
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ""}`}
                onClick={() => onMenuChange && onMenuChange(item.id)}
              >
                <div className={styles.mobileNavIcon}>{item.svg}</div>
                <span className={styles.mobileNavLabel}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
