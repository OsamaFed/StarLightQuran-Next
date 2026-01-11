"use client";

import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./SurahFavorites.module.css";

export default function VerseFavorites() {
  const [verseFavorites, setVerseFavorites] = useState<Array<{id:string,text?:string,surahName?:string,verseNumber?:number}>>([]);

  useEffect(() => {
    const onVF = (ev: Event) => {
      try {
        const favs = (ev as CustomEvent).detail?.favorites as typeof verseFavorites | undefined;
        if (Array.isArray(favs)) setVerseFavorites(favs);
      } catch (e) {}
    };
    window.addEventListener("favoriteVersesChanged", onVF as EventListener);
    try {
      const raw = localStorage.getItem("favoriteVerses");
      if (raw) setVerseFavorites(JSON.parse(raw));
    } catch (e) {}
    return () => window.removeEventListener("favoriteVersesChanged", onVF as EventListener);
  }, []);

  const removeVerse = (id: string) => {
    try {
      const raw = localStorage.getItem("favoriteVerses");
      const arr = raw ? JSON.parse(raw) as Array<{id:string}> : [];
      const next = arr.filter((v) => v.id !== id);
      localStorage.setItem("favoriteVerses", JSON.stringify(next));
      setVerseFavorites(next);
      try { window.dispatchEvent(new CustomEvent("favoriteVersesChanged", { detail: { favorites: next } })); } catch (e) {}
    } catch (e) {}
  };

  const navigateTo = (v: {id:string,surahName?:string,verseNumber?:number}) => {
    try {
      window.dispatchEvent(new CustomEvent('navigateToVerse', { detail: { verseId: v.id, surahName: v.surahName, verseNumber: v.verseNumber } }));
    } catch (e) {}
  };

  return (
    <div className={styles.container}>
      <details className={styles.details}>
        <summary className={styles.summary}>الآيات المفضلة</summary>
        <div className={styles.list}>
          {verseFavorites.length === 0 && <div className={styles.empty}>لا توجد آيات مفضلة بعد</div>}
          {verseFavorites.map((v) => (
            <div key={v.id} className={styles.verseItem}>
              <button className={styles.name} onClick={() => navigateTo(v)}>
                {v.surahName ?? ""} : {v.verseNumber} — {v.text ? (v.text.length > 60 ? v.text.slice(0,60) + '…' : v.text) : ''}
              </button>
              <IconButton size="small" aria-label="إزالة" className={styles.remove} onClick={() => removeVerse(v.id)} sx={{ bgcolor: 'transparent' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
