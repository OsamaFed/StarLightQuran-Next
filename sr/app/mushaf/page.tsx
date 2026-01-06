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
import gsap from "gsap";

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

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTafseerId, setActiveTafseerId] = useState<number | null>(null);

  useScrollRestoration("quran", [loading, currentSurah]);

  const [fontSize, setFontSize] = useState(24);
  const [showWaqfGuide, setShowWaqfGuide] = useState(false);

  useEffect(() => {
    if (!loading && currentVerses.length > 0) {
      const ctx = gsap.context(() => {
        gsap.from(".verse-anim", {
          y: 30,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, currentVerses, currentPage]);

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

          <div className={styles.quranContent} style={{ fontSize: `${fontSize}px` }} ref={containerRef}>
            <div className={styles.versesContainer}>
              {loading && <p className={styles.loadingText}>جاري تحميل السورة...</p>}
              {error && <p className={styles.errorText}>{error}</p>}
              {!loading && !error && !currentSurah && (
                <>
                  <div>
                    <p>اضغط على أي آية لتحميلها كصورة أو نسخها أو مشاركتها</p>
                  </div>
                </>
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
                  </div>
                  <div
                    className={styles.progressBar}
                    style={{
                      ['--progress' as string]: `${(currentPage / totalPages) * 100}%`,
                    }}
                  />
                  {currentVerses.map((ayah, index) => (
                    <div key={ayah.number} className="verse-anim">
                      <Verse
                        ayah={ayah}
                        verseNumber={(currentPage - 1) * 12 + index + 1}
                        surahName={currentSurah.name}
                        onLoadTafseer={loadTafseer}
                        fontSize={fontSize}
                        activeTafseerId={activeTafseerId}
                        setActiveTafseerId={setActiveTafseerId}
                      />
                    </div>
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
