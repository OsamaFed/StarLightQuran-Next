"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import PageHeader from "@/components/layout/PageHeader";
import { AudioPlayer } from "@/components/features";
import styles from "../../azkar/azkar.module.css";

interface DuaItem {
  id: number;
  text: string;
  count: number;
  audio?: string;
}

interface DuaCategory {
  id: number;
  category: string;
  array: DuaItem[];
}

interface ApiResponse {
  success: boolean;
  data: DuaCategory[];
}

export default function DuaCategoryPage() {
  const params = useParams();
  const category = decodeURIComponent(params.category as string);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [duas, setDuas] = useState<DuaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState<DuaCategory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchDuas() {
      try {
        const res = await fetch("/api/duas");
        const data: ApiResponse = await res.json();
        if (data.success) {
          setAllCategories(data.data);
          const categoryData = data.data.find(
            (cat) => cat.category === category
          );
          if (categoryData) {
            setDuas(categoryData.array);
            const index = data.data.findIndex(
              (cat) => cat.category === category
            );
            setCurrentIndex(index);
          }
        }
      } catch (error) {
        console.error("Error fetching duas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDuas();
  }, [category]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 12 },
    },
  };

  const nextCategory = currentIndex < allCategories.length - 1 ? allCategories[currentIndex + 1] : null;

  const prevCategory = currentIndex > 0 ? allCategories[currentIndex - 1] : null;

  return (
    <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ""}`}>
      <div className={styles.container}>
        <PageHeader
          isDarkMode={isDarkMode}
          onToggle={toggleDarkMode}
          backLink="/duas"
          backText="العودة للأدعية"
        />

        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>{category}</h1>
          <p className={styles.subtitle}>{duas.length} دعاء</p>
          <div className={styles.decorLine} />
        </motion.header>

        {loading ? (
          <div className={styles.loadingWrapper}>
            <div className={styles.loadingSpinner} />
          </div>
        ) : duas.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p className={styles.subtitle}>لا توجد أدعية في هذا القسم</p>
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
            {duas.map((item) => (
              <motion.div
                key={item.id}
                className={styles.adhkarItem}
                variants={itemVariants}
              >
                <p className={styles.adhkarText}>{item.text}</p>
                {item.count && (
                  <p className={styles.adhkarCount}>
                    عدد المرات: <strong>{item.count}</strong>
                  </p>
                )}
                {item.audio && (
                  <AudioPlayer
                    audioPath={item.audio}
                    isDarkMode={isDarkMode}
                    size="small"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && duas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              marginTop: "40px",
              paddingTop: "20px",
              borderTop: `1px solid ${
                isDarkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)"
              }`,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {prevCategory && (
              <Link
                href={`/duas/${encodeURIComponent(prevCategory.category)}`}
                className={styles.backLink}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span>→</span>
                <span>{prevCategory.category}</span>
              </Link>
            )}

            {nextCategory && (
              <Link
                href={`/duas/${encodeURIComponent(nextCategory.category)}`}
                className={styles.backLink}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span>{nextCategory.category}</span>
                <span>←</span>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
