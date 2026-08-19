import { useState } from "react";
import styles from "./NewsSection.module.css";
import Button from "../Button/Button";
import BlogReaderModal from "../BlogEditor/BlogReaderModal";

const defaultFallbacks = [
  "/img/landingPage/articleDummy.png",
  "/img/landingPage/dummyDr.png",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80"
];

const getImgSrc = (item, idx) => {
  if (item && item.image && typeof item.image === "string" && item.image.trim().length > 0) return item.image;
  if (item && item.coverImage) return item.coverImage;
  if (item && item.cover_image) return item.cover_image;
  if (item && item.img) return item.img;
  return defaultFallbacks[idx % defaultFallbacks.length];
};

export default function NewsSection({
  newsList = [],
  showHeader = true,
  title = "Berita & Edukasi Kesehatan",
  desc = "Dapatkan informasi, artikel medis, dan edukasi seputar kehamilan, kesehatan anak, dan pola asuh keluarga langsung dari para praktisi ahli kami."
}) {
  const [newsPage, setNewsPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const newsPerPage = 10;
  const totalNewsPages = Math.ceil(newsList.length / newsPerPage) || 1;
  const currentNewsList = newsList.slice((newsPage - 1) * newsPerPage, newsPage * newsPerPage);

  const isFirstPage = newsPage === 1;
  const featuredMain = isFirstPage && currentNewsList.length > 0 ? currentNewsList[0] : null;
  const featuredSide = isFirstPage && currentNewsList.length > 1 ? currentNewsList.slice(1, 5) : [];
  const gridList = isFirstPage ? currentNewsList.slice(5, 10) : currentNewsList;

  return (
    <div className={styles.newsSection}>
      {showHeader && (
        <div className={styles.newsHeader}>
          <h2 className={styles.newsTitle}>{title}</h2>
          <p className={styles.newsSubtitle}>{desc}</p>
        </div>
      )}

      {isFirstPage && (
        <div className={styles.featuredWrapper}>
          {featuredMain && (
            <div
              className={styles.featuredMainCard}
              onClick={() => setSelectedArticle(featuredMain)}
            >
              <div>
                <div className={styles.featuredMainImgWrapper}>
                  <img
                    src={getImgSrc(featuredMain, 0)}
                    alt={featuredMain.title}
                    className={styles.featuredMainImg}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultFallbacks[0];
                    }}
                  />
                </div>
                <p className={styles.metaText}>
                  {featuredMain.category} • {featuredMain.readTime || featuredMain.read_time || "3 min read"} • {featuredMain.date}
                </p>
                <h3 className={styles.featuredMainTitle}>
                  {featuredMain.title}
                </h3>
                <p className={styles.featuredMainSummary}>
                  {featuredMain.summary}
                </p>
              </div>
            </div>
          )}

          {featuredSide.length > 0 && (
            <div className={styles.featuredSideColumn}>
              {featuredSide.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className={styles.featuredSideCard}
                  onClick={() => setSelectedArticle(item)}
                >
                  <div className={styles.featuredSideImgWrapper}>
                    <img
                      src={getImgSrc(item, idx + 1)}
                      alt={item.title}
                      className={styles.featuredSideImg}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultFallbacks[(idx + 1) % defaultFallbacks.length];
                      }}
                    />
                  </div>
                  <div className={styles.featuredSideContent}>
                    <div>
                      <p className={styles.featuredSideMeta}>
                        {item.category} • {item.date}
                      </p>
                      <h4 className={styles.featuredSideTitle}>
                        {item.title}
                      </h4>
                      <p className={styles.gridSummarySingle}>
                        {item.summary}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {gridList.length > 0 && (
        <div className={styles.gridContainer}>
          {gridList.map((item, idx) => (
            <div
              key={item.id || idx}
              className={styles.gridCard}
              onClick={() => setSelectedArticle(item)}
            >
              <div>
                <div className={styles.gridImgWrapper}>
                  <img
                    src={getImgSrc(item, idx + 5)}
                    alt={item.title}
                    className={styles.gridImg}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultFallbacks[idx % defaultFallbacks.length];
                    }}
                  />
                </div>
                <p className={styles.metaText}>
                  {item.category} • {item.date}
                </p>
                <h4 className={styles.gridTitle}>
                  {item.title}
                </h4>
                <p className={styles.gridSummary}>
                  {item.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {newsList.length > newsPerPage && (
        <div className={styles.paginationContainer}>
          <button
            type="button"
            className={styles.paginationBtn}
            disabled={newsPage === 1}
            onClick={() => setNewsPage((p) => Math.max(p - 1, 1))}
          >
            Sebelumnya
          </button>
          <span className={styles.paginationText}>
            Halaman {newsPage} dari {totalNewsPages}
          </span>
          <button
            type="button"
            className={styles.paginationBtn}
            disabled={newsPage === totalNewsPages}
            onClick={() => setNewsPage((p) => Math.min(p + 1, totalNewsPages))}
          >
            Selanjutnya
          </button>
        </div>
      )}

      {selectedArticle && (
        <BlogReaderModal
          isOpen={true}
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}
