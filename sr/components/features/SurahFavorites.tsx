"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { surahs } from "@/data/surahs";
import styles from "./SurahFavorites.module.css";
  import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from "@/hooks/useTheme";

export default function SurahFavorites({ onSelect }: { onSelect?: (id: number) => void }) {
  const { isDarkMode } = useTheme();
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("favoriteSurahs");
      if (raw) setFavorites(JSON.parse(raw));
    } catch (e) {
      setFavorites([]);
    }
    const handler = (ev: Event) => {
      try {
        const favs = (ev as CustomEvent).detail?.favorites as number[] | undefined;
        if (Array.isArray(favs)) setFavorites(favs);
      } catch (e) {}
    };
    window.addEventListener("favoriteChanged", handler as EventListener);
    return () => window.removeEventListener("favoriteChanged", handler as EventListener);
  }, []);

  const save = (arr: number[]) => {
    setFavorites(arr);
    try {
      localStorage.setItem("favoriteSurahs", JSON.stringify(arr));
    } catch (e) {}
  };

  const toggle = (id: number) => {
    const exists = favorites.includes(id);
    const next = exists ? favorites.filter((s) => s !== id) : [id, ...favorites];
    save(next);
  };

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      if (listRef.current) {
        gsap.from(listRef.current.children, { opacity: 0, y: -6, stagger: 0.04, duration: 0.28, ease: "power2.out" });
      }
    } catch (e) {}
  }, [favorites]);

  const favList = favorites
    .map((id) => surahs.find((s) => s.id === id))
    .filter(Boolean) as typeof surahs;

  return (
    <div className={styles.container}>
      <details className={styles.details}>
        <summary className={styles.summary}>
          السور المفضلة
          ({favList.length})</summary>
        <div ref={listRef} className={styles.list}>
          {favList.length === 0 && <div className={styles.empty}>لا توجد سور مفضلة بعد</div>}
          {favList.map((s) => (
            <div key={s.id} className={styles.item}>
              <button
                className={styles.name}
                onClick={() => onSelect && onSelect(s.id)}
              >
                {s.id}. {s.name}
              </button>
              <button className={styles.remove} onClick={() => toggle(s.id)} title="إزالة من المفضلة">
                <CloseIcon fontSize="small" />
              </button>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
