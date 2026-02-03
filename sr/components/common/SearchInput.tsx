"use client";

import { useState } from "react";
import styles from "./SearchInput.module.css";

interface SearchInputProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  debounceDelay?: number;
}

export default function SearchInput({ searchTerm, onSearchChange, debounceDelay = 300 }: SearchInputProps) {
  const [input, setInput] = useState(searchTerm);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    onSearchChange(value);
  };

  return (
    <div className={styles.searchContainer}>
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
          value={input}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
