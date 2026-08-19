import { useState, useEffect } from "react";
import styles from "./LandingPage.module.css";

//components
import PageWrapper from "../../components/PageWrapper/PageWrapper";
import BuatAppointment from "../../components/Button/BuatAppointment/BuatAppointment";
import NewsSection from "../../components/NewsSection/NewsSection";

import { apiService } from "../../services/apiService";

export default function LandingPage() {
  const [isTab, setIsTab] = useState("");
  const [doctorsList, setDoctorsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [faqList, setFaqList] = useState([]);
  const [openFaqId, setOpenFaqId] = useState(null);

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
          <div style={{ backgroundColor: "var(--background)", padding: "64px" }}>
            <NewsSection newsList={newsList} />
          </div>

          {/* Section Tanya Jawab FAQ */}
          <div className={styles.faqSection}>
            <div className={styles.faqHeader}>
              <h2 className={styles.faqTitle}>
                Pertanyaan Umum (FAQ)
              </h2>
              <p className={styles.faqSubtitle}>
                Temukan jawaban lengkap atas berbagai pertanyaan yang sering diajukan mengenai pendaftaran antrean, jam operasional, dan layanan kesehatan kami.
              </p>
            </div>

            <div className={styles.faqListWrapper}>
              {faqList.map((item) => {
                const isOpen = openFaqId === item.id;
                return (
                  <div key={item.id} className={styles.faqCard}>
                    <div
                      className={`${styles.faqCardHeader} ${isOpen ? styles.faqCardHeaderActive : ""}`}
                      onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                    >
                      <h4 className={styles.faqQuestion}>
                        {item.question}
                      </h4>
                      <span className={`${styles.faqArrow} ${isOpen ? styles.faqArrowRotate : ""}`}>
                        ▼
                      </span>
                    </div>
                    {isOpen && (
                      <div className={styles.faqBody}>
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
    </PageWrapper>
  );
}