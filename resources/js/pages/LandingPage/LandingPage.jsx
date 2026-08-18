import { useState, useEffect } from "react";
import styles from "./LandingPage.module.css";

//components
import PageWrapper from "../../components/PageWrapper/PageWrapper";
import BuatAppointment from "../../components/Button/BuatAppointment/BuatAppointment";
import Button from "../../components/Button/Button";
import BlogReaderModal from "../../components/BlogEditor/BlogReaderModal";

import { apiService } from "../../services/apiService";

const defaultFallbacks = [
  "/img/landingPage/articleDummy.png",
  "/img/landingPage/dummyDr.png",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80"
];

const getImgSrc = (item, idx) => {
  if (item.image && typeof item.image === "string" && item.image.trim().length > 0) return item.image;
  if (item.coverImage) return item.coverImage;
  if (item.cover_image) return item.cover_image;
  if (item.img) return item.img;
  return defaultFallbacks[idx % defaultFallbacks.length];
};

export default function LandingPage() {
  const [isTab, setIsTab] = useState("");
  const [doctorsList, setDoctorsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [newsPage, setNewsPage] = useState(1);
  const [faqList, setFaqList] = useState([]);
  const [openFaqId, setOpenFaqId] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    async function loadData() {
      const docs = await apiService.getDoctors();
      setDoctorsList(docs);
      const cats = await apiService.getCategories();
      setCategoriesList(cats);
      const news = await apiService.getNews();
      setNewsList(news);
      const faqs = await apiService.getFaqs();
      setFaqList(faqs);
    }
    loadData();
  }, []);

  const newsPerPage = 10;
  const totalNewsPages = Math.ceil(newsList.length / newsPerPage) || 1;
  const currentNewsList = newsList.slice((newsPage - 1) * newsPerPage, newsPage * newsPerPage);

  const isFirstPage = newsPage === 1;
  const featuredMain = isFirstPage && currentNewsList.length > 0 ? currentNewsList[0] : null;
  const featuredSide = isFirstPage && currentNewsList.length > 1 ? currentNewsList.slice(1, 5) : [];
  const gridList = isFirstPage ? currentNewsList.slice(5, 10) : currentNewsList;

  return (
    <PageWrapper>
      <div className={styles.container}>
        <div className={styles.banner}>
          <div className={styles.titleWrapper}>
            <p className={styles.title}>Perawatan Terbaik untuk Ibu, Bayi,<br />dan Tumbuh Kembang Anak</p>
            <p className={styles.subtitle}>Menemani setiap langkah kesehatan ibu dan tumbuh kembang anak</p>
          </div>
          <BuatAppointment />
        </div>

        <div className={styles.imgSliderWrapper}>
          <div className={styles.imgSlider}></div>
          <div className={styles.imgSlider}></div>
          <div className={styles.imgSlider}></div>
        </div>

        <div>
          <div className={styles.whyContainer}>
            <div className={styles.whyWrapper}>
              <p className={styles.title}>Mengapa memilih kami?</p>
              <div className={styles.why}>
                <p className={styles.title}>Dokter Berpengalaman</p>
                <p className={styles.desc}>Didukung oleh dokter spesialis kandungan, dokter spesialis anak, bidan, serta tenaga kesehatan profesional yang berpengalaman dalam memberikan pelayanan medis sesuai standar kesehatan.</p>
              </div>
              <div className={styles.why}>
                <p className={styles.title}>Pendampingan Menyeluruh</p>
                <p className={styles.desc}>Kami mendampingi setiap tahap perjalanan kesehatan, mulai dari persiapan kehamilan, masa kehamilan, persalinan, masa nifas, hingga pemantauan tumbuh kembang anak dengan pendekatan yang menyeluruh.</p>
              </div>
              <div className={styles.why}>
                <p className={styles.title}>Pelayanan Ramah Keluarga</p>
                <p className={styles.desc}>Kami menghadirkan suasana yang hangat dan nyaman dengan pelayanan yang berfokus pada kebutuhan ibu, bayi, anak, serta keluarga selama menjalani proses perawatan.</p>
              </div>
            </div>
            <div className={styles.whyImgWrapper}>
              <div className={styles.whyImg}></div>
            </div>
          </div>

          <div className={styles.counterWrapper}>
            <div className={styles.counter}>
              <p className={styles.title}>{doctorsList.length}</p>
              <p className={styles.desc}>Profesional Medis</p>
            </div>
            <div className={styles.counter}>
              <p className={styles.title}>10K+</p>
              <p className={styles.desc}>Pasien Dilayani</p>
            </div>
            <div className={styles.counter}>
              <p className={styles.title}>{categoriesList.length}</p>
              <p className={styles.desc}>Kategori Layanan</p>
            </div>
          </div>

          <div className={styles.teamWrapper}>
            <div className={styles.teamTitle}>
              <p className={styles.title}>Tim Profesional Kami</p>
              <p className={styles.desc}>Didukung oleh dokter spesialis kandungan, dokter spesialis anak, bidan, dan tenaga kesehatan profesional yang siap memberikan pelayanan terbaik sesuai kebutuhan Anda.</p>
            </div>
            <div className={styles.teamList}>
              {doctorsList.map((item, index) => (
                <div key={index} className={styles.team}>
                  <div className={styles.teamImgWrapper}>
                    <img src={item.image || "/img/landingPage/dummyDr.png"} alt={item.doctor} />
                  </div>
                  <div className={styles.teamName}>
                    <p className={styles.title}>{item.doctor}</p>
                    <p className={styles.desc}>{item.role || "Praktisi Medis"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.layananContainer}>
            <p className={styles.title}>Pusat Layanan Ibu & Anak</p>
            <div className={styles.layananWrapper}>
              {categoriesList.map((item, index) => (
                <div key={index} className={styles.layanan}>
                  <p className={styles.title}>{item.title}</p>
                  <div>
                    {(item.list || []).map((list, lIndex) => (
                      <div className={styles.desc} key={lIndex}>
                        <p>{list}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.layananMobileWrapper}>
            <p className={styles.title}>Pusat Layanan Ibu & Anak</p>
            {categoriesList.map((item, index) => (
              <div className={styles.layananMobile} key={index}>
                <div className={styles.titleWrapper} onClick={() => setIsTab((prev) => (prev === item.title ? "" : item.title))}>
                  <p className={styles.title}>{item.title}</p>
                  <svg className={`${isTab === item.title ? styles.rotate : ""}`} width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-5.66777e-07 1.06245L1.04108 3.42132e-07L6.71157 5.79036C6.80297 5.88314 6.87551 5.99347 6.92502 6.11501C6.97452 6.23654 7 6.36687 7 6.4985C7 6.63013 6.97452 6.76046 6.92502 6.88199C6.87551 7.00352 6.80297 7.11385 6.71157 7.20663L1.04108 13L0.000981715 11.9375L5.32314 6.5L-5.66777e-07 1.06245Z" fill="black" />
                  </svg>
                </div>
                <div className={`${styles.descWrapper} ${isTab === item.title ? styles.descWrapperOpen : ""}`}>
                  <div>
                    {(item.list || []).map((list, lIndex) => (
                      <div className={styles.desc} key={lIndex}>
                        <p>{list}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section Berita & Edukasi Kesehatan */}
          <div style={{ backgroundColor: "var(--background)", padding: "64px", display: "flex", flexDirection: "column", gap: "32px" }}>
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <h2 style={{ fontFamily: "var(--antonia)", fontSize: "48px", fontWeight: 600, color: "#1F2937", margin: 0 }}>
                Berita & Edukasi Kesehatan
              </h2>
              <p style={{ fontFamily: "var(--artico)", fontSize: "16px", color: "#6b7280", margin: 0, maxWidth: "680px" }}>
                Dapatkan informasi, artikel medis, dan edukasi seputar kehamilan, kesehatan anak, dan pola asuh keluarga langsung dari para praktisi ahli kami.
              </p>
            </div>

            {isFirstPage && (
              <div style={{ display: "flex", gap: "24px", flexDirection: "row", flexWrap: "wrap" }}>
                {featuredMain && (
                  <div
                    style={{ flex: "1 1 500px", display: "flex", flexDirection: "column", backgroundColor: "white", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.04)", cursor: "pointer" }}
                    onClick={() => setSelectedArticle(featuredMain)}
                  >
                    <div style={{ width: "100%", height: "260px", borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
                      <img
                        src={getImgSrc(featuredMain, 0)}
                        alt={featuredMain.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultFallbacks[0];
                        }}
                      />
                    </div>
                    <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 4px 0" }}>
                      {featuredMain.category} • {featuredMain.date}
                    </p>
                    <h3 style={{ fontFamily: "var(--antonia)", fontSize: "22px", fontWeight: 700, color: "var(--primary)", margin: "0 0 10px 0" }}>
                      {featuredMain.title}
                    </h3>
                    <p style={{ fontSize: "14px", color: "#4b5563", margin: "0 0 16px 0", lineHeight: "1.5", flex: 1 }}>
                      {featuredMain.summary}
                    </p>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button onClick={(e) => { e.stopPropagation(); setSelectedArticle(featuredMain); }}>
                        Baca Selengkapnya
                      </Button>
                    </div>
                  </div>
                )}

                {featuredSide.length > 0 && (
                  <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    {featuredSide.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        style={{ backgroundColor: "white", padding: "16px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.04)", display: "flex", gap: "16px", alignItems: "center", cursor: "pointer" }}
                        onClick={() => setSelectedArticle(item)}
                      >
                        <div style={{ width: "90px", height: "90px", borderRadius: "12px", overflow: "hidden", flexShrink: 0, aspectRatio: "1 / 1" }}>
                          <img
                            src={getImgSrc(item, idx + 1)}
                            alt={item.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultFallbacks[(idx + 1) % defaultFallbacks.length];
                            }}
                          />
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                          <div>
                            <p style={{ fontSize: "11px", color: "#6b7280", margin: "0 0 2px 0" }}>
                              {item.category} • {item.date}
                            </p>
                            <h4 style={{ fontFamily: "var(--antonia)", fontSize: "15px", fontWeight: 700, color: "var(--primary)", margin: "0 0 4px 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {item.title}
                            </h4>
                          </div>
                          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                            <Button size="sm" onClick={(e) => { e.stopPropagation(); setSelectedArticle(item); }}>
                              Baca Selengkapnya
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {gridList.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                {gridList.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    style={{ backgroundColor: "white", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", justifyContent: "space-between", cursor: "pointer" }}
                    onClick={() => setSelectedArticle(item)}
                  >
                    <div>
                      <div style={{ width: "100%", height: "160px", borderRadius: "12px", overflow: "hidden", marginBottom: "12px" }}>
                        <img
                          src={getImgSrc(item, idx + 5)}
                          alt={item.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultFallbacks[idx % defaultFallbacks.length];
                          }}
                        />
                      </div>
                      <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 4px 0" }}>
                        {item.category} • {item.date}
                      </p>
                      <h4 style={{ fontFamily: "var(--antonia)", fontSize: "16px", fontWeight: 700, color: "var(--primary)", margin: "0 0 8px 0" }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: "13px", color: "#4b5563", margin: 0, lineHeight: "1.5" }}>
                        {item.summary}
                      </p>
                    </div>
                    <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                      <Button onClick={(e) => { e.stopPropagation(); setSelectedArticle(item); }}>
                        Baca Selengkapnya
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {newsList.length > newsPerPage && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "12px" }}>
                <Button
                  variant="secondary"
                  disabled={newsPage === 1}
                  onClick={() => setNewsPage((p) => Math.max(p - 1, 1))}
                >
                  Sebelumnya
                </Button>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                  Halaman {newsPage} dari {totalNewsPages}
                </span>
                <Button
                  variant="secondary"
                  disabled={newsPage === totalNewsPages}
                  onClick={() => setNewsPage((p) => Math.min(p + 1, totalNewsPages))}
                >
                  Selanjutnya
                </Button>
              </div>
            )}
          </div>

          {/* Section Tanya Jawab FAQ */}
          <div style={{ padding: "64px", display: "flex", flexDirection: "column", gap: "32px" }}>
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <h2 style={{ fontFamily: "var(--antonia)", fontSize: "48px", fontWeight: 600, color: "#1F2937", margin: 0 }}>
                Pertanyaan Umum (FAQ)
              </h2>
              <p style={{ fontFamily: "var(--artico)", fontSize: "16px", color: "#6b7280", margin: 0, maxWidth: "680px" }}>
                Temukan jawaban lengkap atas berbagai pertanyaan yang sering diajukan mengenai pendaftaran antrean, jam operasional, dan layanan kesehatan kami.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
              {faqList.map((item) => {
                const isOpen = openFaqId === item.id;
                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                      transition: "all 0.25s ease"
                    }}
                  >
                    <div
                      style={{
                        padding: "20px 24px",
                        display: "flex",
                        justify: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        backgroundColor: isOpen ? "#FAF5FF" : "white"
                      }}
                      onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                    >
                      <h4 style={{ fontFamily: "var(--artico)", fontSize: "17px", fontWeight: 600, color: "var(--primary)", margin: 0 }}>
                        {item.question}
                      </h4>
                      <span style={{ fontSize: "20px", fontWeight: 700, color: "var(--primary)", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}>
                        ▼
                      </span>
                    </div>
                    {isOpen && (
                      <div style={{ padding: "0 24px 20px 24px", backgroundColor: "#FAF5FF", color: "#4b5563", fontSize: "15px", lineHeight: "1.6" }}>
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {selectedArticle && (
        <BlogReaderModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </PageWrapper>
  );
}