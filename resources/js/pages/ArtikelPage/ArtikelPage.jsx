import { useState, useEffect } from "react";
import styles from "./ArtikelPage.module.css";
import PageWrapper from "../../components/PageWrapper/PageWrapper";
import NewsSection from "../../components/NewsSection/NewsSection";
import { apiService } from "../../services/apiService";

export default function ArtikelPage() {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    async function loadData() {
      const news = await apiService.getNews();
      setNewsList(news);
    }
    loadData();
  }, []);

  return (
    <PageWrapper>
      <div className={styles.container}>
        <div className={styles.banner}>
          <div className={styles.titleWrapper}>
            <p className={styles.title}>Berita & Edukasi Kesehatan</p>
            <p className={styles.subtitle}>
              Temukan informasi medis terpercaya, panduan kesehatan ibu hamil, tips pola asuh anak, dan berita terkini dari tim medis profesional kami.
            </p>
          </div>
        </div>

        <div className={styles.contentSection}>
          <NewsSection newsList={newsList} showHeader={false} />
        </div>
      </div>
    </PageWrapper>
  );
}
