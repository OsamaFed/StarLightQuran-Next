"use client";

import { useState } from "react";
import { Ayah } from "@/types";
import VerseSpeedDial from "./VerseSpeedDial";
import styles from "./VerseCard.module.css";


interface VerseCardProps {
  ayah: Ayah;
  verseNumber: number;
  surahName: string;
  isDarkMode: boolean;
  onLoadTafseer: (ayahNumber: number) => Promise<string | null>;
  fontSize?: number;
  isActive?: boolean;
  onInteraction?: (active: boolean) => void;
}

export default function VerseCard({
  ayah,
  verseNumber,
  surahName,
  isDarkMode,
  onLoadTafseer,
  fontSize = 24,
  isActive = false,
  onInteraction,
}: VerseCardProps) {
  const [showTafseer, setShowTafseer] = useState(false);
  const [tafseer, setTafseer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTafseerClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showTafseer) {
      setShowTafseer(false);
      return;
    }

    if (!tafseer) {
      setLoading(true);
      const tafseerText = await onLoadTafseer(ayah.number);
      setTafseer(tafseerText);
      setLoading(false);
    }
    setShowTafseer(true);
  };

  const handleInteraction = (active: boolean) => {
    if (onInteraction) {
      onInteraction(active);
    }
  };

  // Calculate size based on verse length
  const verseLength = ayah.text.length;
  let sizeClass = "";
  let dynamicStyle: React.CSSProperties = {};

  if (verseLength < 50) {
    sizeClass = styles.sizeVerySmall;
    dynamicStyle = {
      padding: "12px 16px",
      marginBottom: "16px",
    };
  } else if (verseLength < 100) {
    sizeClass = styles.sizeSmall;
    dynamicStyle = {
      padding: "14px 18px",
      marginBottom: "18px",
    };
  } else if (verseLength < 200) {
    sizeClass = styles.sizeMedium;
    dynamicStyle = {
      padding: "20px",
      marginBottom: "24px",
    };
  } else if (verseLength < 300) {
    sizeClass = styles.sizeLarge;
    dynamicStyle = {
      padding: "24px",
      marginBottom: "28px",
    };
  } else {
    sizeClass = styles.sizeVeryLarge;
    dynamicStyle = {
      padding: "28px",
      marginBottom: "32px",
    };
  }

  return (
    <div
      id={`verse-${ayah.numberInSurah}`}
      className={`${styles.verse} ${sizeClass} ${isActive ? styles.active : ""}`}
      style={{ ...dynamicStyle, fontSize: `${fontSize}px` }}
      onClick={() => handleInteraction(!isActive)}
    >
      <span className={styles.verseNumber}>{verseNumber}</span>
      <span className={styles.verseText}>{ayah.text}</span>
      <div className={styles.verseActions}>
        <button
          className={styles.tafseerBtn}
          onClick={handleTafseerClick}
        >
          📖 التفسير
        </button>
      </div>
      {showTafseer && (
        <div className={styles.tafseerText}>
          {loading ? "جاري تحميل التفسير..." : tafseer}
        </div>
      )}
      <VerseSpeedDial
        verseId={`verse-${ayah.numberInSurah}`}
        verseText={ayah.text}
        verseNumber={verseNumber}
        surahName={surahName}
        onOpen={() => handleInteraction(true)}
        onClose={() => handleInteraction(false)}
      />
    </div>
  );
}
