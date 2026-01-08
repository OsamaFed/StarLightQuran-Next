"use client";

import { useState, useRef, useEffect } from "react";
import { surahs } from "@/data/surahs";
import SearchResultsList from "../features/SearchResultsList";
import styles from "./SearchInput.module.css";

interface SearchInputProps {
  onSelectSurah: (surahId: number) => void;
}

export default function SearchInput({ onSelectSurah }: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSurahs = searchTerm.length > 0
    ? surahs.filter((surah) =>
        surah.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(value.length > 0);
  };

  const handleSelectSurah = (surahId: number) => {
    onSelectSurah(surahId);
    setSearchTerm("");
    setShowResults(false);
  };

  return (
    <div className={styles.searchContainer} ref={containerRef}>
      <div className={styles.inputContainer}>
        <div className={styles.shadowInput}></div>
        <button className={styles.inputButtonShadow} type="button">
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            height="20px"
            width="20px"
          >
            <path
              d="M4 9a5 5 0 1110 0A5 5 0 014 9zm5-7a7 7 0 104.2 12.6.999.999 0 00.093.107l3 3a1 1 0 001.414-1.414l-3-3a.999.999 0 00-.107-.093A7 7 0 009 2z"
              fillRule="evenodd"
              fill="#17202A"
            ></path>
          </svg>
        </button>
        <input
          type="text"
          className={styles.inputSearch}
          placeholder="ابحث عن سورة..."
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      <SearchResultsList 
        results={filteredSurahs} 
        onSelect={handleSelectSurah} 
        isVisible={showResults} 
      />
    </div>
  );
}
