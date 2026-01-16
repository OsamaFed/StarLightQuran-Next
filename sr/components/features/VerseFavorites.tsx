"use client";

import styles from "./SurahFavorites.module.css";

export default function VerseFavorites() {
  return (
    <div className={styles.container}>
      <details className={styles.details}>
        <summary className={styles.summary}>الآيات المفضلة(0)</summary>
        <div className={styles.list}>
          <div className={styles.empty}>لا توجد آيات مفضلة بعد</div>
        </div>
      </details>
    </div>
  );
}
