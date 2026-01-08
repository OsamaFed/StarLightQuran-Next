
import { useState, useCallback } from "react";
import { SurahData, Ayah, ApiResponse } from "@/types";


function removeBismillah(text: string, surahNumber: number): string {
  let cleanedText = text;
  if (surahNumber !== 9 && surahNumber !== 1) {
    cleanedText = text.replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/u, "").trim();
  }
  return cleanedText;
}

export function useQuran() {
  const [currentSurah, setCurrentSurah] = useState<SurahData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const VERSES_PER_PAGE = 12;

  const loadSurah = useCallback(async (surahId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahId}/ar.asad`
      );
      const data: ApiResponse = await response.json();

      if (data.code === 200) {
        const processedAyahs = data.data.ayahs.map((ayah) => ({
          ...ayah,
          text: removeBismillah(ayah.text, data.data.number),
        }));

        setCurrentSurah({
          ...data.data,
          ayahs: processedAyahs,
        });
        setCurrentPage(1);
      } else {
        setError("عذراً، لم نتمكن من تحميل السورة");
      }
    } catch (err) {
      console.error("Error loading surah:", err);
      setError("حدث خطأ أثناء تحميل السورة");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTafseer = useCallback(async (ayahNumber: number): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/ar.muyassar`
      );
      const data = await response.json();

      if (data.code === 200 && data.data[0]) {
        return data.data[0].text;
      }
      return null;
    } catch (err) {
      console.error("Error loading tafseer:", err);
      return null;
    }
  }, []);

  const totalPages = currentSurah
    ? Math.ceil(currentSurah.ayahs.length / VERSES_PER_PAGE)
    : 0;

  const currentVerses = currentSurah
    ? currentSurah.ayahs.slice(
        (currentPage - 1) * VERSES_PER_PAGE,
        currentPage * VERSES_PER_PAGE
      )
    : [];

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo(0, 0);
    } else if (currentSurah && currentSurah.number < 114) {
      loadSurah(currentSurah.number + 1);
      window.scrollTo(0, 0);
    }
  }, [currentPage, totalPages, currentSurah, loadSurah]);

  const prevPage = useCallback(async () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo(0, 0);
    } else if (currentSurah && currentSurah.number > 1) {
      try {
        const prevSurahNumber = currentSurah.number - 1;
        const response = await fetch(
          `https://api.alquran.cloud/v1/surah/${prevSurahNumber}/ar.asad`
        );
        const data: ApiResponse = await response.json();

        if (data.code === 200) {
          const processedAyahs = data.data.ayahs.map((ayah) => ({
            ...ayah,
            text: removeBismillah(ayah.text, prevSurahNumber),
          }));

          setCurrentSurah({
            ...data.data,
            ayahs: processedAyahs,
          });
          setCurrentPage(Math.ceil(processedAyahs.length / VERSES_PER_PAGE));
          window.scrollTo(0, 0);
        }
      } catch (err) {
        console.error("Error loading previous surah:", err);
      }
    }
  }, [currentPage, currentSurah]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const nextSurah = useCallback(() => {
    if (currentSurah && currentSurah.number < 114) {
      loadSurah(currentSurah.number + 1);
      window.scrollTo(0, 0);
    }
  }, [currentSurah, loadSurah]);

  const prevSurah = useCallback(() => {
    if (currentSurah && currentSurah.number > 1) {
      loadSurah(currentSurah.number - 1);
      window.scrollTo(0, 0);
    }
  }, [currentSurah, loadSurah]);

  return {
    currentSurah,
    currentPage,
    currentVerses,
    totalPages,
    loading,
    error,
    loadSurah,
    loadTafseer,
    nextPage,
    prevPage,
    goToPage,
    nextSurah,
    prevSurah,
  };
}