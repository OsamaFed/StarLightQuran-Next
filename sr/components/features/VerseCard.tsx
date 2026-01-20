"use client";

import { useState, useEffect } from "react";
import { Ayah } from "@/types";
import VerseSpeedDial from "./VerseSpeedDial";
import styles from "./VerseCard.module.css";


interface VerseCardProps {
  ayah: Ayah;
  verseNumber: number;
  surahName: string;
  surahId: number;
  isDarkMode: boolean;
  onLoadTafseer: (ayahNumber: number) => Promise<string | null>;
  fontSize?: number;
}

export default function VerseCard({
  ayah,
  verseNumber,
  surahName,
  surahId,
  isDarkMode,
  onLoadTafseer,
  fontSize = 24,
}: VerseCardProps) {
  const [showTafseer, setShowTafseer] = useState(false);
  const [tafseer, setTafseer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = async (ev: Event) => {
      try {
        const detail = (ev as CustomEvent).detail;
        if (!detail || !detail.verseId) return;
        const targetId = `verse-${ayah.number}`;
        if (detail.verseId !== targetId) return;

        if (showTafseer) {
          setShowTafseer(false);
          try {
            const evClosed = new CustomEvent("tafsirClosed", { detail: { verseId: targetId } });
            window.dispatchEvent(evClosed);
          } catch (e) {}
          return;
        }

        if (!tafseer) {
          setLoading(true);
          const tafseerText = await onLoadTafseer(ayah.number);
          setTafseer(tafseerText);
          setLoading(false);
          try {
            const evLoaded = new CustomEvent("tafsirLoaded", { detail: { verseId: targetId } });
            window.dispatchEvent(evLoaded);
          } catch (e) {}
        }

        setShowTafseer(true);
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener("openTafsir", handler as EventListener);
    return () => window.removeEventListener("openTafsir", handler as EventListener);
  }, [ayah.number, onLoadTafseer, showTafseer, tafseer]);

  // Calculate size based on verse length
  const verseLength = ayah.text.length;
  let dynamicStyle: React.CSSProperties = {};

  if (verseLength < 50) {
    dynamicStyle = {
      padding: "12px 16px",
      marginBottom: "16px",
    };
  } else if (verseLength < 100) {
    dynamicStyle = {
      padding: "14px 18px",
      marginBottom: "18px",
    };
  } else if (verseLength < 200) {
    dynamicStyle = {
      padding: "20px",
      marginBottom: "24px",
    };
  } else if (verseLength < 300) {
    dynamicStyle = {
      padding: "24px",
      marginBottom: "28px",
    };
  } else {
    dynamicStyle = {
      padding: "28px",
      marginBottom: "32px",
    };
  }

  return (
    <div
      id={`verse-${ayah.number}`}
      className={styles.verse}
      style={{ ...dynamicStyle, fontSize: `${fontSize}px` }}
    >
      <span className={styles.verseNumber}>{verseNumber}</span>
      <span className={styles.verseText}>{ayah.text}</span>
      {/* Tafsir is opened by the small tafsir icon (VerseSpeedDial) via `openTafsir` event */}
      {showTafseer && (
        <div className={styles.tafseerText}>
          {loading ? "جاري تحميل التفسير..." : tafseer}
        </div>
      )}
      <VerseSpeedDial
        verseId={`verse-${ayah.number}`}
        verseText={ayah.text}
        verseNumber={verseNumber}
        surahName={surahName}
        surahId={surahId}
      />
    </div>
  );
}
