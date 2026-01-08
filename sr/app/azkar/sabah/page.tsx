"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import PageHeader from "@/components/layout/PageHeader";
import styles from "../azkar.module.css";

interface AdhkarItem {
  id: number;
  text: string;
  count: number;
  audio?: string;
  filename?: string;
}

interface AdhkarCategory {
  id: number;
  category: string;
  array: AdhkarItem[];
}

interface ApiResponse {
  success: boolean;
  data: AdhkarCategory[];
}

export default function SabahPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [adhkar, setAdhkar] = useState<AdhkarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioInstance) {
        audioInstance.pause();
        audioInstance.src = "";
      }
    };
  }, [audioInstance]);

  const toggleAudio = (id: number, filename?: string) => {
    if (playingId === id) {
      audioInstance?.pause();
      setPlayingId(null);
      return;
    }

    if (audioInstance) {
      audioInstance.pause();
    }

    if (filename) {
      const audioPath = `/audio/${filename}`;
      const newAudio = new Audio(audioPath);
      newAudio.play().catch(err => {
        console.error("Audio playback failed:", err);
        if (err.name === 'NotAllowedError') {
           alert("يرجى التفاعل مع الصفحة أولاً لتتمكن من تشغيل الصوت");
        }
      });
      setAudioInstance(newAudio);
      setPlayingId(id);
      newAudio.onended = () => setPlayingId(null);
    }
  };

  useEffect(() => {
    async function fetchAdhkar() {
      try {
        const res = await fetch("/api/adhkar/sabah");
        const data: ApiResponse = await res.json();
        if (data.success && data.data.length > 0) {
          setAdhkar(data.data[0].array);
        }
      } catch (error) {
        console.error("Error fetching adhkar:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAdhkar();
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 12 },
    },
  };

  return (
    <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ""}`}>
      <div className={styles.backgroundDecor}>
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
      </div>

      <div className={styles.container}>
        <PageHeader
          isDarkMode={isDarkMode}
          onToggle={toggleDarkMode}
          backLink="/azkar"
          backText="العودة للأذكار"
        />

        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>أذكار الصباح</h1>
          <p className={styles.subtitle}>{adhkar.length} ذكر</p>
          <div className={styles.decorLine} />
        </motion.header>

        {loading ? (
          <div className={styles.loadingWrapper}>
            <div className={styles.loadingSpinner} />
          </div>
        ) : (
          <motion.div
            className={styles.adhkarList}
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.08 },
              },
            }}
          >
            {adhkar.map((item) => (
              <motion.div
                key={item.id}
                className={styles.adhkarItem}
                variants={itemVariants}
              >
                <p className={styles.adhkarText}>{item.text}</p>
                <div className={styles.adhkarFooter}>
                  {item.count > 1 && (
                    <div className={styles.adhkarMeta}>
                      <span className={styles.countBadge}>
                        التكرار: {item.count} مرات
                      </span>
                    </div>
                  )}
                  {item.filename && (
                    <button
                      className={`${styles.audioButton} ${playingId === item.id ? styles.playing : ""}`}
                      onClick={() => toggleAudio(item.id, item.filename)}
                      aria-label="استماع"
                    >
                      {playingId === item.id ? "⏸ وقف" : "▶ استماع"}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
