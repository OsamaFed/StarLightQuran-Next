import { useRef, useEffect } from "react";
import styles from "./SearchResults.module.css";

interface Surah {
  id: number;
  name: string;
}

interface SearchResultsProps {
  results: Surah[];
  isVisible: boolean;
  onSelect: (surahId: number) => void;
}

export default function SearchResults({
  results,
  isVisible,
  onSelect,
}: SearchResultsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!isVisible || results.length === 0) return null;

  return (
    <div className={styles.searchResultsContainer} ref={containerRef}>
      {results.map((surah) => (
        <div
          key={surah.id}
          className={styles.resultItem}
          onClick={() => onSelect(surah.id)}
        >
          <span className={styles.resultNumber}>{surah.id}</span>
          <span className={styles.resultName}>{surah.name}</span>
        </div>
      ))}
    </div>
  );
}
