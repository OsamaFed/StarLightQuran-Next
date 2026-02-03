"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconButton } from "@mui/material";
import styles from "./VerseOfTheDay.module.css";

interface VerseData {
  number: number;
  text: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
  };
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajdah: boolean;
}

interface VerseOfTheDayProps {
  isDarkMode: boolean;
}

// ✅ الأيقونة الجديدة
const ShuffleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 15L21 18M21 18L18 21M21 18H18.5689C17.6297 18 17.1601 18 16.7338 17.8705C16.3564 17.7559 16.0054 17.5681 15.7007 17.3176C15.3565 17.0348 15.096 16.644 14.575 15.8626L14.3333 15.5M18 3L21 6M21 6L18 9M21 6H18.5689C17.6297 6 17.1601 6 16.7338 6.12945C16.3564 6.24406 16.0054 6.43194 15.7007 6.68236C15.3565 6.96523 15.096 7.35597 14.575 8.13744L9.42496 15.8626C8.90398 16.644 8.64349 17.0348 8.29933 17.3176C7.99464 17.5681 7.64357 17.7559 7.2662 17.8705C6.83994 18 6.37033 18 5.43112 18H3M3 6H5.43112C6.37033 6 6.83994 6 7.2662 6.12945C7.64357 6.24406 7.99464 6.43194 8.29933 6.68236C8.64349 6.96523 8.90398 7.35597 9.42496 8.13744L9.66667 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const getRandomVerse = async (): Promise<VerseData> => {
  try {
    const randomVerseNumber = Math.floor(Math.random() * 6236) + 1;

    const response = await fetch(
      `https://api.alquran.cloud/v1/ayah/${randomVerseNumber}/quran-simple`
    );
    const data = await response.json();

    if (data.code === 200) {
      return data.data;
    }
    throw new Error("Failed to fetch verse");
  } catch (error) {
    console.error("Error fetching verse:", error);
    throw error;
  }
};

const getTodaysVerse = async (): Promise<VerseData> => {
  try {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() -
        new Date(today.getFullYear(), 0, 0).getTime()) /
        86400000
    );

    const verseNumber = (dayOfYear % 6236) + 1;

    const response = await fetch(
      `https://api.alquran.cloud/v1/ayah/${verseNumber}/quran-simple`
    );
    const data = await response.json();

    if (data.code === 200) {
      return data.data;
    }
    throw new Error("Failed to fetch verse");
  } catch (error) {
    console.error("Error fetching today's verse:", error);
    throw error;
  }
};

export default function VerseOfTheDay({
  isDarkMode,
}: VerseOfTheDayProps) {
  const [verse, setVerse] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isRandom, setIsRandom] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadTodaysVerse = async () => {
      setLoading(true);
      setError(null);
      setIsRandom(false);
      try {
        const todaysVerse = await getTodaysVerse();
        setVerse(todaysVerse);
      } catch (err) {
        setError("فشل في تحميل الآية");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTodaysVerse();
  }, []);

  const handleRandomize = async () => {
    setLoading(true);
    setError(null);
    setIsRandom(true);
    try {
      const randomVerse = await getRandomVerse();
      setVerse(randomVerse);
    } catch (err) {
      setError("فشل في تحميل آية عشوائية");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={`${styles.verseCard} ${mounted && isDarkMode ? styles.dark : ""}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>آية اليوم</h1>
        <IconButton
          onClick={handleRandomize}
          disabled={loading}
          className={styles.randomButton}
          size="small"
          title="الحصول على آية عشوائية"
          aria-label="الحصول على آية عشوائية"
        >
          <ShuffleIcon />
        </IconButton>
      </div>

      <div className={styles.content}>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.loading}
            >
              <div className={styles.spinner} />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.error}
            >
              {error}
            </motion.div>
          ) : verse ? (
            <motion.div
              key={`${verse.surah?.number ?? "s"}_${verse.numberInSurah ?? 0}_$${verse.number ?? 0}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={styles.verseContent}
            >
              <p className={`${styles.verseText} ${isRandom ? styles.centeredVerseText : ""}`}>{verse.text ?? "لا توجد آية للعرض"}</p>
              <div className={styles.verseReference}>
                <span className={styles.surahName}>{verse.surah.name}</span>
                <span className={styles.verseNumber}>
                  {verse.numberInSurah}
                </span>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
