"use client";

import { useState } from "react";
import { useQuran } from "@/hooks/useQuran";
import { useTheme } from "@/hooks/useTheme";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { PageHeader } from "@/components/layout";
import { SearchInput, DecorativeElements, Pagination } from "@/components/common";
import { SurahSelector, Verse } from "@/components/features";
import { FontControls, DarkModeToggle } from "@/components/ui";
import { WaqfGuide } from "@/components/common";
import styles from "./mushaf.module.css";

export default function MushafPage() {
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
  const [activeVerseId, setActiveVerseId] = useState<string | null>(null);

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 36));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 18));
  };

  const handleSurahSelect = (surahId: number) => {
    loadSurah(surahId);
    setActiveVerseId(null);
  };

  const handleVerseInteraction = (verseId: string | null) => {
    setActiveVerseId(verseId);
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
            <div className={styles.versesContainer}>
              {loading && <p className={styles.loadingText}>جاري تحميل السورة...</p>}
              {error && <p className={styles.errorText}>{error}</p>}
              {!loading && !error && !currentSurah && (
                <div className={styles.introContainer}>
                  <p className={styles.introTitle}>اختر سورة من المصحف ثم حدِّد آية للتفاعل معها.</p>
                  <p className={styles.introSubtitle}>بعد ذلك يمكنك:</p>
                  <ul className={styles.introList}>
                    <li>حفظ صورة الآية</li>
                    <li>مشاركة الآية مع غيرك</li>
                    <li>نسخ نص الآية</li>
                    <li>تشغيل التلاوة الصوتية والاستماع لها</li>
                  </ul>
                  <p className={styles.introFooter}>خذ وقتك مع الآيات… فالقرآن يُقرأ بتدبّر 🤍</p>
                </div>
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
                      isActive={activeVerseId === `verse-${ayah.numberInSurah}`}
                      onInteraction={(active) => handleVerseInteraction(active ? `verse-${ayah.numberInSurah}` : null)}
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
