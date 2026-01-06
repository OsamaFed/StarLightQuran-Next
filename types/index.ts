export interface Surah {
  id: number;
  name: string;
  verses: number;
  type: "مكية" | "مدنية";
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export interface ApiResponse {
  code: number;
  status: string;
  data: SurahData;
}

export interface TafseerResponse {
  code: number;
  status: string;
  data: Array<{
    text: string;
    number: number;
  }>;
}