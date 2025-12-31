"use client";

import styles from "../common/SearchInput.module.css";

interface SearchResult {
  id: number;
  name: string;
}

interface SearchResultsListProps {
  results: SearchResult[];
  onSelect: (id: number) => void;
  isVisible: boolean;
}

export default function SearchResultsList({
  results,
  onSelect,
  isVisible,
}: SearchResultsListProps) {
  if (!isVisible || results.length === 0) return null;

  return (
    <div className={styles.searchResults}>
      {results.map((surah) => (
        <div
          key={surah.id}
          className={styles.searchResultItem}
          onClick={() => onSelect(surah.id)}
        >
          {surah.id}. {surah.name}
        </div>
      ))}
    </div>
  );
}
