"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { surahs } from "@/data/surahs";
import { useQuran } from "@/hooks/useQuran";
import { useTheme } from "@/hooks/useTheme";
import { PageHeader } from "@/components/layout";
import { SearchInput, Pagination, ScrollToTop } from "@/components/common";
import { SurahSelector, VerseCard, SurahFavorites, SurahStarButton, SearchResults } from "@/components/features";
import VerseFavorites from "@/components/features/VerseFavorites";
import { FontControls } from "@/components/ui";
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

  const [fontSize, setFontSize] = useState(24);
  const [showWaqfGuide, setShowWaqfGuide] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<{
    surahNumber: number;
    verseNumber: number;
  } | null>(null);

  const versesContainerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement | null>(null);

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

  const scrollToVerseWithHighlight = (verseNumber: number, retryCount = 0) => {
    const verseElement = document.querySelector(`[data-verse-number="${verseNumber}"]`) as HTMLElement;

    if (verseElement) {
      verseElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });

      verseElement.style.transition = 'background-color 0.3s ease-in-out';
      verseElement.style.backgroundColor = 'rgba(212, 163, 115, 0.3)';

      const highlightTimeout = setTimeout(() => {
        verseElement.style.backgroundColor = '';
        verseElement.style.transition = 'background-color 0.3s ease-in-out';
      }, 3000);

      return () => clearTimeout(highlightTimeout);
    } else {
      console.warn(`Verse element not found for verse number: ${verseNumber}, retry: ${retryCount}`);

      if (retryCount < 3) {
        setTimeout(() => {
          scrollToVerseWithHighlight(verseNumber, retryCount + 1);
        }, 200 * (retryCount + 1));
      } else {
        console.error(`Failed to find verse ${verseNumber} after ${retryCount} retries`);
      }
    }
  };

  useEffect(() => {
    const handleNavigateToVerse = async (event: Event) => {
      try {
        const detail = (event as CustomEvent).detail;
        if (!detail?.surahNumber || detail.verseNumber === undefined) {
          console.warn('Invalid navigation event detail:', detail);
          return;
        }

        const { surahNumber, verseNumber } = detail;

        if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
          console.error('Invalid surah number:', surahNumber);
          return;
        }

        if (isNaN(verseNumber) || verseNumber < 1) {
          console.error('Invalid verse number:', verseNumber);
          return;
        }

        if (currentSurah?.number !== surahNumber) {
          await loadSurah(surahNumber);
        }

        setPendingNavigation({ surahNumber, verseNumber });

      } catch (e) {
        console.error('Error navigating to verse:', e);
        setPendingNavigation(null);
      }
    };

    window.addEventListener('navigateToVerse', handleNavigateToVerse as EventListener);
    return () => window.removeEventListener('navigateToVerse', handleNavigateToVerse as EventListener);
  }, [currentSurah?.number, loadSurah]);

  useEffect(() => {
    if (introRef.current && !currentSurah && !loading && !error) {
      try {
        const nodes = Array.from(introRef.current.children) as HTMLElement[];
        gsap.from(nodes, {
          y: 18,
          opacity: 0,
          stagger: 0.12,
          duration: 0.6,
          ease: "power3.out",
        });
      } catch (e) {
        // ignore animation errors in SSR or unexpected states
      }
    }
  }, [currentSurah, loading, error]);

  useEffect(() => {
    if (!pendingNavigation || loading) return;

    if (currentSurah?.number === pendingNavigation.surahNumber && currentVerses.length > 0) {
      const { verseNumber } = pendingNavigation;

      const verseExists = currentVerses.some(
        verse => verse.number === verseNumber || verse.numberInSurah === verseNumber
      );

      if (!verseExists) {
        goToVerse(verseNumber, true);
      } else {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollToVerseWithHighlight(verseNumber);
            setPendingNavigation(null);
          });
        });
      }
    }
  }, [currentSurah, currentVerses, loading, pendingNavigation, goToVerse]);

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
                  <p className={styles.introFooter}>خذ وقتك مع الآيات… فالقرآن يُقرأ بتدبّر </p>
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
                      verseNumber={ayah.numberInSurah}
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
