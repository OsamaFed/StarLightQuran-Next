"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./SurahFavorites.module.css";
import { useTheme } from "@/hooks/useTheme";
import CloseIcon from '@mui/icons-material/Close';

interface FavoriteVerse {
  id: string;
  verseNumber: number;
  surahName: string;
  text: string;
  surahId?: number;
}

export default function VerseFavorites() {
  const { isDarkMode } = useTheme();
  const [favorites, setFavorites] = useState<FavoriteVerse[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("favoriteVerses");
      if (raw) setFavorites(JSON.parse(raw));
    } catch (e) {
      setFavorites([]);
    }
    const handler = (ev: Event) => {
      try {
        const favs = (ev as CustomEvent).detail?.favorites as FavoriteVerse[] | undefined;
        if (Array.isArray(favs)) setFavorites(favs);
      } catch (e) {}
    };
    window.addEventListener("favoriteVerseChanged", handler as EventListener);
    return () => window.removeEventListener("favoriteVerseChanged", handler as EventListener);
  }, []);

  const save = (arr: FavoriteVerse[]) => {
    setFavorites(arr);
    try {
      localStorage.setItem("favoriteVerses", JSON.stringify(arr));
      window.dispatchEvent(new CustomEvent("favoriteVerseChanged", { detail: { favorites: arr } }));
    } catch (e) {}
  };

  const toggle = (id: string) => {
    const exists = favorites.find((v) => v.id === id);
    const next = exists ? favorites.filter((v) => v.id !== id) : [...favorites];
    save(next);
  };

  const handleSelectVerse = (verse: FavoriteVerse) => {
    try {
      // Extract surah number from verseId or use surahId
      let surahNumber = verse.surahId;
      
      if (!surahNumber) {
        // Fallback: try to parse from verseId (format: "surahNumber-verseNumber" or similar)
        const parts = verse.id.split('-');
        surahNumber = parseInt(parts[0]);
      }
      
      if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
        console.error('Invalid surah number:', surahNumber);
        return;
      }

      // Dispatch event to load surah and navigate to verse
      window.dispatchEvent(new CustomEvent('navigateToVerse', { 
        detail: { 
          surahNumber,
          verseNumber: verse.verseNumber 
        } 
      }));
    } catch (e) {
      console.error('Error navigating to verse:', e);
    }
  };

  const handleItemClick = (e: React.MouseEvent, verse: FavoriteVerse) => {
    if ((e.target as HTMLElement).closest(`.${styles.remove}`)) {
      return;
    }
    handleSelectVerse(verse);
  };

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      if (listRef.current) {
        gsap.from(listRef.current.children, { opacity: 0, y: -6, stagger: 0.04, duration: 0.28, ease: "power2.out" });
      }
    } catch (e) {}
  }, [favorites]);

  return (
    <div className={styles.container}>
      <details className={styles.details}>
        <summary className={styles.summary}>الآيات المفضلة({favorites.length})</summary>
        <div ref={listRef} className={styles.list}>
          {favorites.length === 0 && <div className={styles.empty}>لا توجد آيات مفضلة بعد</div>}
          {favorites.map((v) => (
            <div key={v.id} className={styles.item} onClick={(e) => handleItemClick(e, v)}>
              <span className={styles.name} title={`اذهب إلى ${v.surahName}:${v.verseNumber}`}>
                {v.surahName}:{v.verseNumber}
              </span>
              <button className={styles.remove} onClick={() => toggle(v.id)}>
                <CloseIcon fontSize="small" />
              </button>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
