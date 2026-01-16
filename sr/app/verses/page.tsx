"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useTheme } from "@/hooks/useTheme";
import PageHeader from "@/components/layout/PageHeader";
import ScrollToTop from "@/components/common/ScrollToTop";
import { Aurora } from "@/components/ui";
import styles from "./verses.module.css";
import Link from "next/link";

interface FavoriteVerse {
  id: string;
  verseNumber: number;
  surahName: string;
  text: string;
}

export default function VersesPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [favorites, setFavorites] = useState<FavoriteVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("favoriteVerses");
      if (raw) setFavorites(JSON.parse(raw));
    } catch (e) {
      setFavorites([]);
    }
    setLoading(false);

    const handler = (ev: Event) => {
      try {
        const favs = (ev as CustomEvent).detail?.favorites as FavoriteVerse[] | undefined;
        if (Array.isArray(favs)) setFavorites(favs);
      } catch (e) {}
    };
    window.addEventListener("favoriteVerseChanged", handler as EventListener);
    return () => window.removeEventListener("favoriteVerseChanged", handler as EventListener);
  }, []);

  useEffect(() => {
    try {
      if (listRef.current) {
        gsap.from(listRef.current.children, { opacity: 0, y: -6, stagger: 0.04, duration: 0.28, ease: "power2.out" });
      }
    } catch (e) {}
  }, [favorites]);

  return (
    <div className={`${styles.wrapper} ${isDarkMode ? styles.darkMode : ""}`}>
      <div className={styles.aurorabg}><Aurora /></div>
      <div className={styles.container}>
        <PageHeader
          isDarkMode={isDarkMode}
          onToggle={toggleDarkMode}
          backLink="/mushaf"
          backText="العودة للمصحف"
          showDarkModeToggle={false}
        />
        
        <div className={styles.content}>
          <h1 className={styles.title}>الآيات المفضلة</h1>
          
          {loading && <p className={styles.loadingText}>جاري تحميل المفضلة...</p>}
          
          {!loading && favorites.length === 0 && (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>لا توجد آيات مفضلة حتى الآن</p>
              <Link href="/mushaf" className={styles.backButton}>
                اذهب للمصحف
              </Link>
            </div>
          )}
          
          {!loading && favorites.length > 0 && (
            <div ref={listRef} className={styles.versesGrid}>
              {favorites.map((verse) => (
                <div key={verse.id} className={styles.verseCard}>
                  <div className={styles.verseHeader}>
                    <span className={styles.surahName}>{verse.surahName}</span>
                    <span className={styles.verseNumber}>:{verse.verseNumber}</span>
                  </div>
                  <div className={styles.verseText}>{verse.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <ScrollToTop />
      </div>
    </div>
  );
}
