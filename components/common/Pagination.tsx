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
}: PaginationProps) {
  return (
    <div className={styles.pagination}>
      <button
        className={styles.btn}
        onClick={onPrevSurah}
        disabled={!hasPrevSurah}
      >
        السورة السابقة
      </button>
      <button
        className={styles.btn}
        onClick={onPrevPage}
        disabled={currentPage <= 1}
      >
        الصفحة السابقة
      </button>
      <span className={styles.pageNumber}>
        {currentPage} / {totalPages}
      </span>
      <select
        className={styles.pageSelect}
        value={currentPage}
        onChange={(e) => onGoToPage(parseInt(e.target.value))}
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
      >
        الصفحة التالية
      </button>
      <button
        className={styles.btn}
        onClick={onNextSurah}
        disabled={!hasNextSurah}
      >
        السورة التالية
      </button>
    </div>
  );
}
