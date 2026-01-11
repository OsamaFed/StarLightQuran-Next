"use client";

import { useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import gsap from "gsap";
import styles from "./SurahFavorites.module.css";
import { useTheme } from "@/hooks/useTheme";

export default function SurahStarButton({ surahNumber }: { surahNumber: number }) {
  const { isDarkMode } = useTheme();
  const [active, setActive] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("favoriteSurahs");
      const arr = raw ? JSON.parse(raw) as number[] : [];
      setActive(arr.includes(surahNumber));
    } catch (e) {
      setActive(false);
    }
  }, [surahNumber]);

  const toggle = () => {
    try {
      const raw = localStorage.getItem("favoriteSurahs");
      const arr = raw ? JSON.parse(raw) as number[] : [];
      const exists = arr.includes(surahNumber);
      const next = exists ? arr.filter((s) => s !== surahNumber) : [surahNumber, ...arr];
      localStorage.setItem("favoriteSurahs", JSON.stringify(next));
      setActive(!exists);
      try {
        window.dispatchEvent(new CustomEvent("favoriteChanged", { detail: { favorites: next } }));
      } catch (e) {}
      if (btnRef.current) {
        gsap.fromTo(btnRef.current, { scale: 0.9, rotate: 0 }, { scale: 1.15, rotate: 12, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <IconButton
      ref={btnRef}
      onClick={toggle}
      aria-label="أضف للمفضلة"
      size="small"
      sx={{
        color: active ? (isDarkMode ? '#FFD54F' : '#FFB400') : (isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.6)'),
        bgcolor: 'transparent',
        borderRadius: '8px',
        boxShadow: 'var(--shadow-xs)',
        '&:hover': { bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)' }
      }}
    >
      {active ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
    </IconButton>
  );
}
