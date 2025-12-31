"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import PageHeader from "@/components/PageHeader";
import styles from "../azkar.module.css";

interface AdhkarItem {
  id: number;
  text: string;
  count: number;
  audio: string;
}

interface AdhkarCategory {
  id: number;
  category: string;
  array: AdhkarItem[];
}

interface ApiResponse {
  success: boolean;
  data: AdhkarCategory[];
  totalItems: number;
}

export default function SabahPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [adhkar, setAdhkar] = useState<AdhkarItem[]>([]);
  const [loading, setLoading] = useState(true);

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
                <div className={styles.adhkarMeta}>
                  
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
