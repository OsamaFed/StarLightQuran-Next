"use client";

import styles from "./TopControls.module.css";
import { SearchInput } from "@/components/common";
import { SurahSelector } from "@/components/features";
import { FontControls, DarkModeToggle } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";

export default function TopControls({ currentSurahId, onSurahSelect, onIncrease, onDecrease }: any) {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className={styles.topControls}>
      <div className={styles.left}> 
        <div className={styles.appTitle}>القرآن الكريم</div>
        <div className={`${styles.searchWrapper} responsiveSearch`}>
          <SearchInput onSelectSurah={onSurahSelect} />
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.controlsRow}>
          <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
          <FontControls onIncrease={onIncrease} onDecrease={onDecrease} />
          <SurahSelector currentSurahId={currentSurahId} onSelect={onSurahSelect} />
        </div>
      </div>
    </div>
  );
}
