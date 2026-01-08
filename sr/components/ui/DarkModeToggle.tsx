"use client";

import styles from "./DarkModeToggle.module.css";

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export default function DarkModeToggle({ isDarkMode, onToggle }: DarkModeToggleProps) {
  return (
    <label className={styles.switch}>
      <input
        className={styles.input}
        type="checkbox"
        checked={isDarkMode}
        onChange={onToggle}
      />
      <div className={`${styles.slider}`}>
        <div className={styles.sunMoon}>
          <svg className={`${styles.moonDot} ${styles.moonDot1}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className={`${styles.moonDot} ${styles.moonDot2}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className={`${styles.moonDot} ${styles.moonDot3}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className={`${styles.lightRay} ${styles.lightRay1}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className={`${styles.lightRay} ${styles.lightRay2}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className={`${styles.lightRay} ${styles.lightRay3}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className={`${styles.cloudDark} ${styles.cloud1}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className={`${styles.cloudDark} ${styles.cloud2}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className={`${styles.cloudDark} ${styles.cloud3}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className={`${styles.cloudLight} ${styles.cloud4}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className={`${styles.cloudLight} ${styles.cloud5}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className={`${styles.cloudLight} ${styles.cloud6}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
        </div>
        <div className={styles.stars}>
          <svg className={`${styles.star} ${styles.star1}`} viewBox="0 0 20 20">
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
          </svg>
          <svg className={`${styles.star} ${styles.star2}`} viewBox="0 0 20 20">
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
          </svg>
          <svg className={`${styles.star} ${styles.star3}`} viewBox="0 0 20 20">
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
          </svg>
          <svg className={`${styles.star} ${styles.star4}`} viewBox="0 0 20 20">
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
          </svg>
        </div>
      </div>
    </label>
  );
}
