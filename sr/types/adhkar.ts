export interface AdhkarItem {
  id: number;
  text: string;
  count: number;
  audio: string;
  filename: string;
}

export interface AdhkarCategory {
  id: number;
  category: string;
  audio: string;
  filename: string;
  array: AdhkarItem[];
}

export interface CategorizedData {
  adhkarSabah: AdhkarCategory[];
  adhkarMasa: AdhkarCategory[];
  adhkarGeneral: AdhkarCategory[];
  duas: AdhkarCategory[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count: number;
  totalItems: number;
}
