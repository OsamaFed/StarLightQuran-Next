"use client";

import { surahs } from "@/data/surahs";
import styles from "./SurahSelector.module.css";

interface SurahSelectorProps {
  currentSurahId: number | null | undefined;
  onSelect: (surahId: number) => void;
}

export default function SurahSelector({ currentSurahId, onSelect }: SurahSelectorProps) {
  return (
    <div className={styles.container}>
      <svg
        y="0"
        xmlns="http://www.w3.org/2000/svg"
        x="0"
        width="100"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        height="100"
        className={styles.arrow}
      >
        <path
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M60.7,53.6,50,64.3m0,0L39.3,53.6M50,64.3V35.7m0,46.4A32.1,32.1,0,1,1,82.1,50,32.1,32.1,0,0,1,50,82.1Z"
        ></path>
      </svg>
      <select
        className={styles.select}
        value={currentSurahId || ""}
        onChange={(e) => {
          const value = e.target.value;
          if (value) {
            onSelect(parseInt(value));
          }
        }}
      >
        <option value="">اختر سورة</option>
        {surahs.map((surah) => (
          <option key={surah.id} value={surah.id}>
            {surah.id}. {surah.name}
          </option>
        ))}
      </select>
    </div>
  );
}
