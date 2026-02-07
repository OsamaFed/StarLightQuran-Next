"use client";

import { useEffect, useState, useMemo, memo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import PageHeader from "@/components/layout/PageHeader";
import ScrollToTop from "@/components/common/ScrollToTop";
import styles from "../azkar/azkar.module.css";

interface DuaCategory {
  id: number;
  category: string;
  array: Array<{ id: number; text: string; count: number }>;
  filterCategory?: string;
}

interface ApiResponse {
  success: boolean;
  data: DuaCategory[];
  count: number;
  totalItems: number;
}

type FilterKey = "all" | "salah" | "distress" | "sunnah" | "quran" | "istighfar" | "prophets";

const filterCategories: { key: FilterKey; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "salah", label: "أدعية الصلاة" },
  { key: "distress", label: "أدعية الهم والكرب" },
  { key: "prophets", label: "أدعية الأنبياء" },
  { key: "istighfar", label: "أدعية الاستغفار" },
];

const categoryToFilter: Record<string, FilterKey> = {
  "دعاء قبل الصلاة": "salah",
  "دعاء أثناء الصلاة": "salah",
  "دعاء بعد الصلاة": "salah",
  "دعاء الاستفتاح": "salah",
  "دعاء السجود": "salah",
  "دعاء التشهد": "salah",
  "دعاء الكرب": "distress",
  "دعاء الضيق": "distress",
  "دعاء الفرج": "distress",
  "دعاء الراحة النفسية": "distress",
  "دعاء السفر": "sunnah",
  "دعاء الطعام": "sunnah",
  "دعاء النوم": "sunnah",
  "دعاء الاستيقاظ": "sunnah",
  "دعاء الزواج": "sunnah",
  "دعاء دخول المنزل": "sunnah",
  "دعاء زيارة القبور": "sunnah",
  "دعاء المطر": "sunnah",
  "دعاء الرزق": "sunnah",
  "دعاء المريض": "sunnah",
  "أدعية من القرآن": "quran",
  "دعاء ربنا آتنا": "quran",
  "دعاء موسى عليه السلام": "prophets",
  "دعاء زكريا عليه السلام": "prophets",
  "دعاء إبراهيم عليه السلام": "prophets",
  "دعاء أيوب عليه السلام": "prophets",
  "دعاء نوح عليه السلام": "prophets",
  "دعاء يعقوب عليه السلام": "prophets",
  "دعاء سليمان عليه السلام": "prophets",
  "دعاء يوسف عليه السلام": "prophets",
  "دعاء يونس عليه السلام": "prophets",
  "دعاء الاستخارة": "sunnah",
  "سيد الاستغفار": "istighfar",
  "الاستغفار": "istighfar",
  "دعاء التوبة": "istighfar",
};

const CategoryCardItem = memo(function CategoryCardItem({ 
  cat 
}: { 
  cat: DuaCategory 
}) {
  return (
    <Link
      href={`/duas/${encodeURIComponent(cat.category)}`}
      className={styles.cardLink}
    >
      <div className={styles.categoryCard}>
        <h3 className={styles.categoryTitle}>{cat.category}</h3>
        <p className={styles.categoryCount}>{cat.array.length} أدعية</p>
      </div>
    </Link>
  );
});

const CategoriesGrid = memo(function CategoriesGrid({ 
  categories 
}: { 
  categories: DuaCategory[] 
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

export default function DuasPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [categories, setCategories] = useState<DuaCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      try {
        const res = await fetch("/api/duas");
        const data: ApiResponse = await res.json();

        if (data.success && isMounted) {
          const validCategories = data.data
            .filter(cat => cat.array && cat.array.length > 0 && cat.category.trim() !== "");

          setCategories(validCategories);
          setDataReady(true);
        }
      } catch (error) {
        console.error("Error fetching duas:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
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
        const mappedFilter = categoryToFilter[cat.category];
        const directFilter = cat.filterCategory as FilterKey;
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
          <h1 className={styles.title}>الأدعية</h1>
          <p className={styles.subtitle}>أدعية مأثورة من القرآن والسنة</p>
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
              placeholder="ابحث عن دعاء..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterBarContainer}>
            {filterCategories.map((filter) => (
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

        <div className={styles.categoriesSection}>
          <h2 className={styles.sectionTitle}>جميع الأدعية</h2>

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
