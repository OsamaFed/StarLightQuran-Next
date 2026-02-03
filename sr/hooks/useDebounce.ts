import { useDebounce } from "usehooks-ts";

/**
 * Hook للبحث مع تأخير (debounce)
 * يساعد في تحسين الأداء والحد من استدعاءات API غير الضرورية
 */
export function useSearchDebounce(query: string, delay: number = 300) {
  return useDebounce(query, delay);
}
