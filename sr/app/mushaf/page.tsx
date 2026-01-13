"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { useQuran } from "@/hooks/useQuran";
import { useTheme } from "@/hooks/useTheme";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { PageHeader } from "@/components/layout";
import { SearchInput, DecorativeElements, Pagination } from "@/components/common";
import { SurahSelector, Verse, SurahFavorites, SurahStarButton } from "@/components/features";
import { FontControls, DarkModeToggle } from "@/components/ui";
import { WaqfGuide } from "@/components/common";
import styles from "./mushaf.module.css";
import { Aurora } from "@/components/ui/";


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
      <div className={styles.aurorabg}><Aurora /></div>
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
        </header>

        <div className={styles.controlsGrid}>
          <div className={styles.searchSection}>
            <div className={styles.searchCard}>
              <SearchInput onSelectSurah={handleSurahSelect} />
            </div>
            <div className={styles.favoritesSmall}>
              <SurahFavorites onSelect={handleSurahSelect} />
            </div>
          </div>

          <div className={styles.surahSection}>
            <div className={styles.surahCard}>
              <SurahSelector
                currentSurahId={currentSurah?.number}
                onSelect={handleSurahSelect}
              />
            </div>
            </div>
            
          <div className={styles.toolsSection}>
            <FontControls
              onIncrease={increaseFontSize}
              onDecrease={decreaseFontSize}
            />
            <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
          </div>
        </div>

        <div className={styles.quranFrame}>

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
                  <div className={styles.surahIndicator}>
                    <span className={styles.surahName}>{currentSurah.name.replace(/\s+/g, ' ')}</span>
                            <SurahStarButton surahNumber={currentSurah.number} />
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
