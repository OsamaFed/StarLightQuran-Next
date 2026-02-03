import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "usehooks-ts";

export interface UseSearchOptions {
  debounceDelay?: number;
  onSearch?: (query: string) => void;
}

/**
 * Hook شامل للبحث مع debounce وإدارة الحالة
 */
export function useSearch(options: UseSearchOptions = {}) {
  const { debounceDelay = 300, onSearch } = options;
  
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, debounceDelay);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    clearSearch,
    isSearching: searchQuery !== debouncedQuery,
  };
}
