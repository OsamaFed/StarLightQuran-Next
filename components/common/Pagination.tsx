"use client";

import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onGoToPage: (page: number) => void;
  onNextSurah: () => void;
  onPrevSurah: () => void;
  hasNextSurah: boolean;
  hasPrevSurah: boolean;
  isDarkMode?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  onGoToPage,
  onNextSurah,
  onPrevSurah,
  hasNextSurah,
  hasPrevSurah,
  isDarkMode = false,
}: PaginationProps) {
  return (
    <div className={`${styles.pagination} ${isDarkMode ? styles.darkMode : styles.lightMode}`} role="navigation" aria-label="pagination">
      <div className={styles.card}>
        <button
          className={styles.btn}
          onClick={onPrevSurah}
          disabled={!hasPrevSurah}
          aria-label="السورة السابقة"
        >
          <span className={styles.arrow}>→</span>
          <span>السورة السابقة</span>
        </button>

        <button
          className={styles.btn}
          onClick={onPrevPage}
          disabled={currentPage <= 1}
          aria-label="الصفحة السابقة"
        >
          <span>الصفحة السابقة</span>
        </button>

        <span className={styles.pageNumber}>
          {currentPage} / {totalPages}
        </span>

        <select
          className={styles.pageSelect}
          value={currentPage}
          onChange={(e) => onGoToPage(parseInt(e.target.value))}
          aria-label="اختر الصفحة"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <option key={page} value={page}>
              صفحة {page}
            </option>
          ))}
        </select>

        <button
          className={styles.btn}
          onClick={onNextPage}
          disabled={currentPage >= totalPages}
          aria-label="الصفحة التالية"
        >
          <span>الصفحة التالية</span>
        </button>

        <button
          className={styles.btn}
          onClick={onNextSurah}
          disabled={!hasNextSurah}
          aria-label="السورة التالية"
        >
          <span>السورة التالية</span>
          <span className={styles.arrow}>←</span>
        </button>
      </div>
    </div>
  );
}
