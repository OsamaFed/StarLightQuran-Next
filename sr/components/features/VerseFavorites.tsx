"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import styles from "./SurahFavorites.module.css";
import { useTheme } from "@/hooks/useTheme";
import CloseIcon from '@mui/icons-material/Close';

// Constants
const STORAGE_KEY = "favoriteVerses";
const EVENT_NAME = "favoriteVerseChanged";
const NAVIGATE_EVENT = "navigateToVerse";
const MIN_SURAH = 1;
const MAX_SURAH = 114;

interface FavoriteVerse {
  id: string;
  verseNumber: number;
  surahName: string;
  text: string;
  surahId?: number;
}

// Utility functions
const isValidSurahNumber = (num: number): boolean => {
  return !isNaN(num) && num >= MIN_SURAH && num <= MAX_SURAH;
};

const getSurahNumber = (verse: FavoriteVerse): number => {
  return verse.surahId ?? parseInt(verse.id.split('-')[0]);
};

const loadFavorites = (): FavoriteVerse[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error loading favorites:', e);
    return [];
  }
};

const saveFavorites = (favorites: FavoriteVerse[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, { detail: { favorites } })
    );
  } catch (e) {
    console.error('Error saving favorites:', e);
  }
};

export default function VerseFavorites() {
  const { isDarkMode } = useTheme();
  const [favorites, setFavorites] = useState<FavoriteVerse[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);

  const hasFavorites = useMemo(() => favorites.length > 0, [favorites]);

  // Load favorites on mount
  useEffect(() => {
    setFavorites(loadFavorites());

    const handler = (ev: Event) => {
      const favs = (ev as CustomEvent).detail?.favorites as FavoriteVerse[] | undefined;
      if (Array.isArray(favs)) {
        setFavorites(favs);
      }
    };

    window.addEventListener(EVENT_NAME, handler as EventListener);
    return () => window.removeEventListener(EVENT_NAME, handler as EventListener);
  }, []);

  // Animate list items
  useEffect(() => {
    if (listRef.current?.children.length) {
      gsap.from(listRef.current.children, {
        opacity: 0,
        y: -6,
        stagger: 0.04,
        duration: 0.28,
        ease: "power2.out"
      });
    }
  }, [favorites]);

  const removeFavorite = (id: string) => {
    const updated = favorites.filter((v) => v.id !== id);
    setFavorites(updated);
    saveFavorites(updated);
  };

  const handleSelectVerse = (verse: FavoriteVerse) => {
    try {
      const surahNumber = getSurahNumber(verse);

      if (!isValidSurahNumber(surahNumber)) {
        console.error('Invalid surah number:', surahNumber);
        return;
      }


      window.dispatchEvent(
        new CustomEvent(NAVIGATE_EVENT, {
          detail: {
            surahNumber,
            verseNumber: verse.verseNumber,
            scrollToVerse: true 
          }
        })
      );
    } catch (e) {
      console.error('Error navigating to verse:', e);
    }
  };


  const handleItemClick = (e: React.MouseEvent, verse: FavoriteVerse) => {
    // Don't navigate if clicking the remove button
    if ((e.target as HTMLElement).closest(`.${styles.remove}`)) {
      return;
    }
    handleSelectVerse(verse);
  };

  return (
    <div className={styles.container}>
      <details className={styles.details}>
        <summary className={styles.summary}>
          الآيات المفضلة ({favorites.length})
        </summary>
        <div ref={listRef} className={styles.list}>
          {!hasFavorites && (
            <div className={styles.empty}>لا توجد آيات مفضلة بعد</div>
          )}
          {favorites.map((verse) => (
            <div
              key={verse.id}
              className={styles.item}
              onClick={(e) => handleItemClick(e, verse)}
              role="button"
              tabIndex={0}
            >
              <span
                className={styles.name}
                title={`اذهب إلى ${verse.surahName}:${verse.verseNumber}`}
              >
                {verse.surahName}:{verse.verseNumber}
              </span>
              <button
                className={styles.remove}
                onClick={() => removeFavorite(verse.id)}
                aria-label={`إزالة ${verse.surahName}:${verse.verseNumber} من المفضلة`}
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
