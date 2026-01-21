"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { surahs } from "@/data/surahs";
import { useQuran } from "@/hooks/useQuran";
import { useTheme } from "@/hooks/useTheme";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { PageHeader } from "@/components/layout";
import { SearchInput, Pagination, ScrollToTop } from "@/components/common";
import { SurahSelector, VerseCard, SurahFavorites, SurahStarButton, SearchResults } from "@/components/features";
import VerseFavorites from "@/components/features/VerseFavorites";
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
    goToVerse,
    nextSurah,
    prevSurah,
  } = useQuran();

  useScrollRestoration("quran", [loading, currentSurah]);

  const [fontSize, setFontSize] = useState(24);
  const [showWaqfGuide, setShowWaqfGuide] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [pendingVerseScroll, setPendingVerseScroll] = useState<number | null>(null);

  const versesContainerRef = useRef<HTMLDivElement>(null);

  const filteredSurahs = searchTerm.length > 0
    ? surahs.filter((surah) =>
        surah.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 36));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 18));
  };

  const handleSurahSelect = (surahId: number) => {
    loadSurah(surahId);
    setShowWaqfGuide(false);
    setSearchTerm("");
    setShowResults(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setShowResults(value.length > 0);
  };

  // دالة للـ scroll مع highlight
  const scrollToVerseWithHighlight = (verseNumber: number) => {
    const verseElement = document.querySelector(`[data-verse-number="${verseNumber}"]`) as HTMLElement;

    if (verseElement) {
      // Smooth scroll to verse
      verseElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });

      // Apply highlight style with smooth transition
      verseElement.style.transition = 'background-color 0.3s ease-in-out';
      verseElement.style.backgroundColor = 'rgba(212, 163, 115, 0.3)';

      // Remove highlight after 3 seconds
      const highlightTimeout = setTimeout(() => {
        verseElement.style.backgroundColor = '';
        verseElement.style.transition = 'background-color 0.3s ease-in-out';
      }, 3000);

      return () => clearTimeout(highlightTimeout);
    } else {
      console.warn(`Verse element not found for verse number: ${verseNumber}`);
    }
  };

  // Handle navigation to favorite verse
  useEffect(() => {
    const handleNavigateToVerse = (event: Event) => {
      try {
        const detail = (event as CustomEvent).detail;
        if (!detail?.surahNumber || detail.verseNumber === undefined) {
          console.warn('Invalid navigation event detail:', detail);
          return;
        }

        const { surahNumber, verseNumber, scrollIntoView = true } = detail;

        // Validate surah number
        if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
          console.error('Invalid surah number:', surahNumber);
          return;
        }

        // Validate verse number
        if (isNaN(verseNumber) || verseNumber < 1) {
          console.error('Invalid verse number:', verseNumber);
          return;
        }

        // Same surah - direct navigation
        if (currentSurah?.number === surahNumber) {
          goToVerse(verseNumber);
          if (scrollIntoView) {
            // Small delay to ensure page change is rendered
            setTimeout(() => {
              setPendingVerseScroll(verseNumber);
            }, 50);
          }
        } else {
          // Different surah - load it first, then navigate
          loadSurah(surahNumber);
          
          // Schedule navigation after surah loads and renders
          const navTimeout = setTimeout(() => {
            goToVerse(verseNumber);
            if (scrollIntoView) {
              setPendingVerseScroll(verseNumber);
            }
          }, 500);

          return () => clearTimeout(navTimeout);
        }
      } catch (e) {
        console.error('Error navigating to verse:', e);
      }
    };

    window.addEventListener('navigateToVerse', handleNavigateToVerse as EventListener);
    return () => window.removeEventListener('navigateToVerse', handleNavigateToVerse as EventListener);
  }, [currentSurah?.number, loadSurah, goToVerse, setPendingVerseScroll]);

  // Effect للـ scroll بعد تحميل الآيات
  useEffect(() => {
    if (pendingVerseScroll !== null && !loading && currentVerses.length > 0) {
      // Wait for DOM to fully update
      const timer = setTimeout(() => {
        const verseElement = document.querySelector(
          `[data-verse-number="${pendingVerseScroll}"]`
        ) as HTMLElement;

        if (verseElement) {
          scrollToVerseWithHighlight(pendingVerseScroll);
        } else {
          console.warn(`Verse ${pendingVerseScroll} not found in DOM`);
        }

        setPendingVerseScroll(null);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [pendingVerseScroll, loading, currentVerses]);

  return (
    <div className={`${styles.wrapper} ${isDarkMode ? styles.darkMode : ""}`}>
      <div className={styles.container}>
        <PageHeader
          isDarkMode={isDarkMode}
          onToggle={toggleDarkMode}
          backLink="/"
          backText="العودة للرئيسية"
          showDarkModeToggle={true}
        />
        <header className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.titleText}>وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</h1>
          </div>
          <div className={styles.controlsGrid}>
            <div className={styles.searchAndSurahSection}>
              <SearchInput 
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
              />
              <div className={styles.SearchResults}>
                <SearchResults
                  results={filteredSurahs}
                  isVisible={showResults}
                  onSelect={handleSurahSelect}
                />
              </div>
              <SurahSelector
                currentSurahId={currentSurah?.number}
                onSelect={handleSurahSelect}
              />
            </div>

            <div className={styles.favoritesSection}>
              <SurahFavorites onSelect={handleSurahSelect} />
              <div className={styles.fontControlsCenter}>
                <FontControls
                  onIncrease={increaseFontSize}
                  onDecrease={decreaseFontSize}
                />
              </div>
              <VerseFavorites />
            </div>
          </div>
        </header>

        <div className={styles.quranFrame}>
          <div className={styles.quranContent} style={{ fontSize: `${fontSize}px` }}>
            <div className={styles.versesContainer} ref={versesContainerRef}>
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
                  {currentVerses.map((ayah, index) => (
                    <VerseCard
                      key={ayah.number}
                      ayah={ayah}
                      verseNumber={(currentPage - 1) * 12 + index + 1}
                      surahName={currentSurah.name}
                      surahId={currentSurah.number}
                      isDarkMode={isDarkMode}
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
            isDarkMode={isDarkMode}
          />
        )}
        <ScrollToTop isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}
