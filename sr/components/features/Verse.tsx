"use client";

import { useState } from "react";
import { Ayah } from "@/types";
import VerseCard from "./VerseCard";
import { useTheme } from "@/hooks/useTheme";

interface VerseProps {
  ayah: Ayah;
  verseNumber: number;
  surahName: string;
  onLoadTafseer: (ayahNumber: number) => Promise<string | null>;
  fontSize?: number;
  isActive?: boolean;
  onInteraction?: (active: boolean) => void;
}

export default function Verse({ ayah, verseNumber, surahName, onLoadTafseer, fontSize, isActive, onInteraction }: VerseProps) {
  const { isDarkMode } = useTheme();

  return (
    <VerseCard
      ayah={ayah}
      verseNumber={verseNumber}
      surahName={surahName}
      isDarkMode={isDarkMode}
      onLoadTafseer={onLoadTafseer}
      fontSize={fontSize}
      isActive={isActive}
      onInteraction={onInteraction}
    />
  );
}
