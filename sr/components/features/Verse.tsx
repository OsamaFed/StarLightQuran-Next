"use client";

import { useState } from "react";
import { Ayah } from "@/types";
import VerseCard from "./VerseCard";
import { useTheme } from "@/hooks/useTheme";

interface VerseProps {
  ayah: Ayah;
  verseNumber: number;
  surahName: string;
  surahId: number;
  onLoadTafseer: (ayahNumber: number) => Promise<string | null>;
  fontSize?: number;
}

export default function Verse({ ayah, verseNumber, surahName, surahId, onLoadTafseer, fontSize }: VerseProps) {
  const { isDarkMode } = useTheme();

  return (
    <VerseCard
      ayah={ayah}
      verseNumber={verseNumber}
      surahName={surahName}
      surahId={surahId}
      isDarkMode={isDarkMode}
      onLoadTafseer={onLoadTafseer}
      fontSize={fontSize}
    />
  );
}
