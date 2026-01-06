"use client";

import { useEffect, useState, useMemo, memo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import PageHeader from "@/components/layout/PageHeader";
import ScrollToTop from "@/components/common/ScrollToTop";
import { Aurora } from "@/components/ui";
import styles from "./azkar.module.css";

interface AdhkarCategory {
  id: number;
  category: string;
  array: Array<{ id: number; text: string; count: number }>;
  filterCategory?: string;
}

interface ApiResponse {
  success: boolean;
  data: AdhkarCategory[];
  count: number;
  totalItems: number;
}

type AdhkarFilterKey = "all" | "salah" | "wudu" | "prophet" | "sunnah" | "sleep";

const adhkarFilterCategories: { key: AdhkarFilterKey; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "salah", label: "أذكار الصلاة" },
  { key: "wudu", label: "أذكار الوضوء" },
  { key: "sleep", label: "أذكار النوم" },
];

const adhkarCategoryToFilter: Record<string, AdhkarFilterKey> = {
  "الأذكار قبل الصلاة": "salah",
  "الأذكار بعد السلام من الصلاة": "salah",
  "التشهد": "salah",
  "الصلاة على النبي بعد التشهد": "salah",
  "أذكار الآذان": "salah",
  "الذكر قبل الوضوء": "wudu",
  "الذكر بعد الفراغ من الوضوء": "wudu",
  "أذكار الوضوء": "wudu",
  "الصلاة على النبي": "prophet",
  "أذكار النبي": "prophet",
  "أذكار مأثورة عن الرسول": "prophet",
  "أذكار النوم": "sleep",
  "أذكار الاستيقاظ من النوم": "sleep",
  "الذكر عند الخروج من المنزل": "sunnah",
  "الذكر عند دخول المنزل": "sunnah",
  "أذكار الحج والعمرة": "sunnah",
  "أذكار عامة": "sunnah",
  "الأذكار اليومية": "sunnah",
};

const mainCards = [
  {
    title: "أذكار الصباح",
    description: "أذكار تُقال في الصباح",
    link: "/azkar/sabah",
    gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  },
  {
    title: "أذكار المساء",
    description: "أذكار تُقال في المساء",
    link: "/azkar/masa",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
];

const CategoryCardItem = memo(function CategoryCardItem({ 
  cat 
}: { 
  cat: AdhkarCategory 
}) {
  return (
    <Link 
      href={`/azkar/${encodeURIComponent(cat.category)}`} 
      className={styles.cardLink}
    >
      <div className={styles.categoryCard}>
        <h3 className={styles.categoryTitle}>{cat.category}</h3>
        <p className={styles.categoryCount}>{cat.array.length} أذكار</p>
      </div>
    </Link>
  );
});

const CategoriesGrid = memo(function CategoriesGrid({ 
  categories 
}: { 
  categories: AdhkarCategory[] 
}) {
  return (
    <motion.div
      className={styles.categoriesGrid}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {categories.map((cat) => (
        <div key={cat.id} className={styles.categoryWrapper}>
          <CategoryCardItem cat={cat} />
        </div>
      ))}
    </motion.div>
  );
});

export default function AzkarPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [categories, setCategories] = useState<AdhkarCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);
  const [activeFilter, setActiveFilter] = useState<AdhkarFilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      try {
        const res = await fetch("/api/adhkar/general");
        const data: ApiResponse = await res.json();

        if (data.success && isMounted) {
          const validCategories = data.data
            .filter(cat => cat.array && cat.array.length > 0 && cat.category.trim() !== "");

          setCategories(validCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
          setDataReady(true);
        }
      }
    }

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCategories = useMemo(() => {
    let result = categories;

    if (activeFilter !== "all") {
      result = result.filter((cat) => {
        const mappedFilter = adhkarCategoryToFilter[cat.category];
        const directFilter = cat.filterCategory as AdhkarFilterKey;
        return mappedFilter === activeFilter || directFilter === activeFilter;
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((cat) => {
        const categoryMatch = cat.category.toLowerCase().includes(query);
        const textMatch = cat.array.some((item) =>
          item.text.toLowerCase().includes(query)
        );
        return categoryMatch || textMatch;
      });
    }

    return result;
  }, [categories, activeFilter, searchQuery]);

  const showContent = !loading && dataReady;

  return (
    <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ""}`}>
      <div className={styles.auroraBg}>
        <Aurora
          colorStops={isDarkMode ? ['#000000', '#1a1a2e', '#16213e'] : ['#f0f4f8', '#d9e2ec', '#bcccdc']}
          blend={0.8}
          amplitude={1.2}
        />
      </div>
      <div className={styles.backgroundDecor}>
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
      </div>

      <div className={styles.container}>
        <PageHeader
          isDarkMode={isDarkMode}
          onToggle={toggleDarkMode}
          backLink="/"
          backText="العودة للرئيسية"
        />

        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>الأذكار</h1>
          <p className={styles.subtitle}>حصّن نفسك بذكر الله</p>
          <div className={styles.decorLine} />
        </motion.header>

        <motion.div
          className={styles.filterSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="ابحث عن ذكر..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterBarContainer}>
            {adhkarFilterCategories.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`${styles.filterButton} ${
                  activeFilter === filter.key ? styles.filterButtonActive : ""
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={styles.mainCardsGrid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {mainCards.map((card, index) => (
            <div key={index}>
              <Link href={card.link} className={styles.cardLink}>
                <div className={styles.mainCard}>
                  <div className={styles.cardGradient} style={{ background: card.gradient }} />
                  <div className={styles.cardContent}>
                    <h2 className={styles.cardTitle}>{card.title}</h2>
                    <p className={styles.cardDescription}>{card.description}</p>
                  </div>
                  <div className={styles.cardShine} />
                </div>
              </Link>
            </div>
          ))}
        </motion.div>

        <div className={styles.categoriesSection}>
          <h2 className={styles.sectionTitle}>الأذكار الأخرى</h2>

          {!showContent ? (
            <div className={styles.loadingWrapper}>
              <div className={styles.loadingSpinner} />
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className={styles.noResults}>
              لا توجد نتائج مطابقة للبحث
            </div>
          ) : (
            <CategoriesGrid categories={filteredCategories} />
          )}
        </div>
      </div>

      <ScrollToTop isDarkMode={isDarkMode} />
    </div>
  );
}
