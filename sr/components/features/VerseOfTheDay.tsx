"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconButton } from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
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

const getRandomVerse = async (): Promise<VerseData> => {
  try {
    // Pick a random surah and verse, use caching to avoid repeated fetches
    const randomSurah = Math.floor(Math.random() * 114) + 1;

    // fetch surah metadata with timeout
    const surahResponse = await fetchWithTimeout(
      `https://api.alquran.cloud/v1/surah/${randomSurah}`
    );
    if (!surahResponse.ok) throw new Error("Failed to fetch surah info");
    const surahData = await surahResponse.json();
    const numberOfAyahs = surahData?.data?.numberOfAyahs || 0;

    if (!numberOfAyahs) throw new Error("Surah has no ayahs info");

    const randomVerse = Math.floor(Math.random() * numberOfAyahs) + 1;
    const cacheKey = `verse_${randomSurah}_${randomVerse}`;

    // Return cached verse if exists
    const cached = (typeof window !== "undefined" && localStorage.getItem(cacheKey)) || null;
    if (cached) {
      try {
        return JSON.parse(cached) as VerseData;
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }

    const response = await fetchWithTimeout(
      `https://api.alquran.cloud/v1/surah/${randomSurah}/${randomVerse}`
    );
    if (!response.ok) throw new Error("Failed to fetch verse");
    const data = await response.json();
    if (data.code === 200) {
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(cacheKey, JSON.stringify(data.data));
        }
      } catch (_) {}
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
    // Use date to generate a consistent daily verse
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() -
        new Date(today.getFullYear(), 0, 0).getTime()) /
        86400000
    );
    
    // 6236 is the total number of verses in Quran
    const verseNumber = (dayOfYear % 6236) + 1;
    const cacheKey = `votd_${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;

    // Return cached daily verse if exists
    const cached = (typeof window !== "undefined" && localStorage.getItem(cacheKey)) || null;
    if (cached) {
      try {
        return JSON.parse(cached) as VerseData;
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }

    const response = await fetchWithTimeout(
      `https://api.alquran.cloud/v1/ayah/${verseNumber}`
    );
    if (!response.ok) throw new Error("Failed to fetch today's verse");
    const data = await response.json();
    
    if (data.code === 200) {
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(cacheKey, JSON.stringify(data.data));
        }
      } catch (_) {}
      return data.data;
    }
    throw new Error("Failed to fetch verse");
  } catch (error) {
    console.error("Error fetching today's verse:", error);
    throw error;
  }
};

// Helper fetch with timeout to avoid hanging requests
async function fetchWithTimeout(input: RequestInfo, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(input, { signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export default function VerseOfTheDay({
  isDarkMode,
}: VerseOfTheDayProps) {
  const [verse, setVerse] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTodaysVerse = async () => {
      setLoading(true);
      setError(null);
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
      className={`${styles.verseCard} ${isDarkMode ? styles.dark : ""}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>آية اليوم</h2>
        <IconButton
          onClick={handleRandomize}
          disabled={loading}
          className={styles.randomButton}
          size="small"
          title="حصول على آية عشوائية"
        >
          <CasinoIcon />
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
              key={verse.number}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={styles.verseContent}
            >
              <p className={styles.verseText}>{verse.text}</p>
              <div className={styles.verseReference}>
                <span className={styles.surahName}>{verse.surah.name}</span>
                <span className={styles.verseNumber}>
                  {verse.numberInSurah}:{verse.surah.number}
                </span>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
