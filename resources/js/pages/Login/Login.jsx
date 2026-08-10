import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Login.module.css";
import dummyUsersData from "../../json/UserDashboardDummy.json";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [hide, setHide] = useState(true);
  const date = new Date();
  const year = date.getFullYear();

  const [data, setData] = useState({
    username: "",
    password: ""
  });
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const registeredUser = localStorage.getItem("registeredUser");
    if (location.state?.username) {
      setData({
        username: location.state.username,
        password: location.state.password || ""
      });
    } else if (registeredUser) {
      try {
        const parsed = JSON.parse(registeredUser);
        if (parsed.username) {
          setData({
            username: parsed.username,
            password: parsed.password || ""
          });
        }
      } catch (err) {
      }
    }
  }, [location.state]);

  const handleLogin = () => {
    setErrorMsg("");
    if (!data.username.trim()) {
      setErrorMsg("Username wajib diisi.");
      return;
    }

    const usernameInput = data.username.trim();
    localStorage.setItem("loggedInUser", usernameInput);

    if (data.password) {
      localStorage.setItem("userPassword", data.password);
    }

    const foundUser = dummyUsersData.users.find(
      (u) => u.username.toLowerCase() === usernameInput.toLowerCase()
    );

    const isAdmin = usernameInput.toLowerCase() === "admin" || foundUser?.role === "admin";
    const targetPath = isAdmin ? "/admin-dashboard" : "/dashboard";

    navigate(targetPath);
  };

  const fillDummyUser = (username, password) => {
    setData({ username, password });
    setErrorMsg("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.imgWrapper}>
          <img src="/logo.png" alt="Logo" />
        </div>
        <div className={styles.loginWrapper}>
          <div className={styles.titleWrapper}>
            <p className={styles.title}>Selamat Datang</p>
            <p className={styles.subTitle}>Masuk ke Akun JnC Anda</p>
          </div>
        </div>
        <div className={styles.login}>
          <div className={styles.loginForm}>
            <label className={styles.inputLabel}>Username</label>
            <input
              className={styles.input}
              type="text"
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
              placeholder="Masukkan username"
            />
          </div>
          <div className={styles.loginForm}>
            <label className={styles.inputLabel}>Password</label>
            <div className={styles.inputPassword}>
              <input
                className={styles.password}
                type={hide ? "password" : "text"}
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                placeholder="Masukkan password"
              />
              <div className={styles.eyeButton} onClick={() => setHide(!hide)}>
                {hide ? "Lihat" : "Sembunyikan"}
              </div>
            </div>
          </div>

          {errorMsg && (
            <p style={{ color: "#ef4444", fontSize: "14px", margin: "4px 0 0 0", fontFamily: "var(--font-artico)" }}>
              {errorMsg}
            </p>
          )}

          <div className={styles.masuk} onClick={handleLogin}>
            Masuk
          </div>

          <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "rgba(0,0,0,0.6)" }}>Pilihan Akun Dummy (Demo):</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => fillDummyUser("admin", "admin123")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid black",
                  background: "#D896ED",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                admin (Role Admin)
              </button>
              <button
                type="button"
                onClick={() => fillDummyUser("siti123", "123")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid black",
                  background: "#FAF0FC",
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                siti123 (Ada Antrean)
              </button>
              <button
                type="button"
                onClick={() => fillDummyUser("dewi123", "123")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid black",
                  background: "white",
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                dewi123 (Belum Antrean)
              </button>
            </div>
          </div>

          <div className={styles.bottomWrapper}>
            <p>
              Lupa Password?{" "}
              <a href="#">
                Hubungi Admin{" "}
                <svg width="12" height="12" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 10V16C16 16.5304 15.7893 17.0391 15.4142 17.4142C15.0391 17.7893 14.5304 18 14 18H2C1.46957 18 0.960859 17.7893 0.585786 17.4142C0.210714 17.0391 0 16.5304 0 16V4C0 3.46957 0.210714 2.96086 0.585786 2.58579C0.960859 2.21071 1.46957 2 2 2H8V4H2V16H14V10H16ZM10 0V2H14.586L6.793 9.793L8.207 11.207L16 3.414V8H18V0H10Z" fill="black" />
                </svg>
              </a>
            </p>
            <p>
              Belum punya akun? <span onClick={() => navigate("/appointment")} style={{ cursor: "pointer", color: "black", textDecoration: "underline" }}>Buat akun</span>
            </p>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>PEMBATASAN HUKUM DAN KETENTUAN PENGGUNAAN YANG BERLAKU UNTUK SITUS INI</p>
          <p>Dengan menggunakan situs ini, Anda dianggap menyetujui ketentuan penggunaan yang berlaku.</p>
          <p>© {year} JnC Family Care Metro</p>
        </div>
      </div>
    </div>
  );
}