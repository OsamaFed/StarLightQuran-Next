"use client";

import { useState } from "react";
import { useQuran } from "@/hooks/useQuran";
import { useTheme } from "@/hooks/useTheme";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import PageHeader from "../layout/PageHeader";
import SearchInput from "../common/SearchInput";
import SurahSelector from "./SurahSelector";
import FontControls from "../ui/FontControls";
import Verse from "./Verse";
import DecorativeElements from "../common/DecorativeElements";
import Pagination from "../common/Pagination";
import styles from "./QuranReader.module.css";
import DarkModeToggle from "../ui/DarkModeToggle";
import WaqfGuide from "../common/WaqfGuide";

export default function QuranReader() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const {
    currentSurah,
    currentPage,
    currentVerses,
    totalPages,
    loading,
    error,
    loadSurah,
    loadTafseer,
    nextPage,
    prevPage,
    goToPage,
    nextSurah,
    prevSurah,
  } = useQuran();

  useScrollRestoration("quran", [loading, currentSurah]);

  const [fontSize, setFontSize] = useState(24);
  const [showWaqfGuide, setShowWaqfGuide] = useState(false);

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 36));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 18));
  };

  const handleSurahSelect = (surahId: number) => {
    loadSurah(surahId);
    setShowWaqfGuide(false);
  };

  return (
    <div className={`${styles.wrapper} ${isDarkMode ? styles.darkMode : ""}`}>
      <div className={styles.container}>
        <PageHeader
          isDarkMode={isDarkMode}
          onToggle={toggleDarkMode}
          backLink="/"
          backText="العودة للرئيسية"
          showDarkModeToggle={false}
        />
        <header className={styles.header}>
          <div className={styles.titleContainer}>
            <div className={styles.subtitle}>وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</div>
          </div>
          <div className={styles.controls}>
            <SearchInput onSelectSurah={handleSurahSelect} />
            <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
            <SurahSelector
              currentSurahId={currentSurah?.number}
              onSelect={handleSurahSelect}
            />
            <FontControls
              onIncrease={increaseFontSize}
              onDecrease={decreaseFontSize}
            />
          </div>
        </header>

        <div className={styles.quranFrame}>
          <DecorativeElements />

          <div className={styles.quranContent} style={{ fontSize: `${fontSize}px` }}>
            <div className={styles.waqfDropdownContainer}>
              <button 
                className={styles.waqfDropdownBtn}
                onClick={() => setShowWaqfGuide(!showWaqfGuide)}
              >
                <span>علامات الوقوف</span>
                <span className={`${styles.dropdownArrow} ${showWaqfGuide ? styles.arrowUp : ""}`}>▼</span>
              </button>
              {showWaqfGuide && (
                <div className={styles.waqfDropdownContent}>
                  <WaqfGuide />
                </div>
              )}
            </div>

            <div className={styles.versesContainer}>
              {loading && <p className={styles.loadingText}>جاري تحميل السورة...</p>}
              {error && <p className={styles.errorText}>{error}</p>}
              {!loading && !error && !currentSurah && (
                <>
                  <WaqfGuide className={styles.waqfGuideWelcome} />
                  <div>
                    <p>اضغط على أي آية لتحميلها كصورة أو نسخها أو مشاركتها</p>
                  </div>
                </>
              )}
              {currentSurah && (
                <>
                  <div className={styles.surahIndicator}>
                    <span className={styles.surahName}>{currentSurah.name.replace(/\s+/g, ' ')}</span>
                  </div>
                  <div
                    className={styles.progressBar}
                    style={{
                      ['--progress' as string]: `${(currentPage / totalPages) * 100}%`,
                    }}
                  />
                  {currentVerses.map((ayah, index) => (
                    <Verse
                      key={ayah.number}
                      ayah={ayah}
                      verseNumber={(currentPage - 1) * 12 + index + 1}
                      surahName={currentSurah.name}
                      onLoadTafseer={loadTafseer}
                      fontSize={fontSize}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
          
        </div>

        {currentSurah && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={nextPage}
            onPrevPage={prevPage}
            onGoToPage={goToPage}
            onNextSurah={nextSurah}
            onPrevSurah={prevSurah}
            hasNextSurah={currentSurah.number < 114}
            hasPrevSurah={currentSurah.number > 1}
          />
        )}

      </div>
    </div>
  );
}
