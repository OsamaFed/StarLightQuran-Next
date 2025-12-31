"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import PageHeader from "@/components/PageHeader";
import styles from "../azkar.module.css";

interface AdhkarItem {
  id: number;
  text: string;
  count: number;
  audio?: string;
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

export default function CategoryPage() {
  const params = useParams();
  const category = decodeURIComponent(params.category as string);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [adhkar, setAdhkar] = useState<AdhkarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState<AdhkarCategory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchAdhkar() {
      try {
        const res = await fetch("/api/adhkar/general");
        const data: ApiResponse = await res.json();
        if (data.success) {
          setAllCategories(data.data);
          const categoryData = data.data.find(
            (cat) => cat.category === category
          );
          if (categoryData) {
            setAdhkar(categoryData.array);
            const index = data.data.findIndex(
              (cat) => cat.category === category
            );
            setCurrentIndex(index);
          }
        }
      } catch (error) {
        console.error("Error fetching adhkar:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAdhkar();
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


const prevCategory = currentIndex > 0 ? allCategories[currentIndex - 1] : null

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
          <h1 className={styles.title}>{category}</h1>
          <p className={styles.subtitle}>{adhkar.length} ذكر</p>
          <div className={styles.decorLine} />
        </motion.header>

        {loading ? (
          <div className={styles.loadingWrapper}>
            <div className={styles.loadingSpinner} />
          </div>
        ) : adhkar.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p className={styles.subtitle}>لا توجد أذكار في هذا القسم</p>
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
                {item.count > 1 && (
                  <div className={styles.adhkarMeta}>
                    <span className={styles.countBadge}>
                      التكرار: {item.count} مرات
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && adhkar.length > 0 && (
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
                href={`/azkar/${encodeURIComponent(prevCategory.category)}`}
                className={styles.backLink}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span>→</span>
                <span>{prevCategory.category}</span>
              </Link>
            )}

            {nextCategory && (
              <Link
                href={`/azkar/${encodeURIComponent(nextCategory.category)}`}
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
