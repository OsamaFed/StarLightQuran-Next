"use client";

import styles from "./FontControls.module.css";

interface FontControlsProps {
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function FontControls({ onIncrease, onDecrease }: FontControlsProps) {
  return (
    <div className={styles.container}>
      <button className={`${styles.btn} ${styles.increaseBtn}`} onClick={onIncrease}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5V19M5 12H19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={styles.btnText}>تكبير</span>
      </button>
      <button className={`${styles.btn} ${styles.decreaseBtn}`} onClick={onDecrease}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12H19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={styles.btnText}>تصغير</span>
      </button>
    </div>
  );
}
