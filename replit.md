# StarLight Quran

## Overview

StarLight Quran is an Arabic-language Islamic application built with Next.js that provides a comprehensive Quran reader experience. The app includes features for reading the Quran (Mushaf), morning/evening adhkar (Islamic remembrances), duas (supplications), and prayer times. The interface is fully RTL (right-to-left) with custom Arabic typography and supports dark/light theme modes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **Next.js 16** with App Router architecture
- **React 19** for UI components
- **TypeScript** for type safety
- Pages organized under `sr/app/` directory following Next.js conventions

### Styling Approach
- **Tailwind CSS 4** with PostCSS integration
- **CSS Modules** for component-scoped styles (`.module.css` files)
- Custom font family "KoGaliModern" loaded via `@font-face` declarations
- Glass-morphism design patterns with backdrop blur effects
- CSS custom properties for theming (dark/light mode support)

### Animation Libraries
- **GSAP** for complex page transitions and scroll animations
- **Framer Motion** for component-level animations and micro-interactions

### WebGL Effects
- **OGL** library for shader-based visual effects (Aurora and Iridescence components)
- Custom GLSL shaders for background animations

### Component Organization
- `components/common/` - Reusable utilities (BackToggle, Pagination, ScrollToTop, SearchInput, WaqfGuide)
- `components/features/` - Domain-specific components (PrayerTimes, SurahSelector, VerseCard, etc.)
- `components/layout/` - Page structure components (PageHeader, OptionCard)
- `components/ui/` - UI primitives (toggles, font controls, visual effects)

### State Management
- React hooks for local state (`useState`, `useEffect`, `useCallback`)
- Custom hooks in `hooks/` directory:
  - `useTheme` - Dark/light mode with localStorage persistence
  - `useQuran` - Quran data fetching and pagination logic
  - `useScrollRestoration` - Scroll position management (currently disabled)

### Data Layer
- Static JSON data in `sr/data/` directory:
  - `adhkar.json` - Islamic remembrances with Arabic text and audio paths
  - `surahs.ts` - Surah metadata (names, verse counts, revelation type)
- API routes under `sr/app/api/` for categorized data access
- External Quran API: `api.alquran.cloud` for verse text and tafseer

### Routing Structure
- `/` - Home page with prayer times and navigation cards
- `/mushaf` - Quran reader with surah selection and verse display
- `/azkar` - Adhkar categories (sabah, masa, general)
- `/duas` - Dua categories

## External Dependencies

### UI Component Library
- **Material UI (@mui/material)** - Icons and utility components (IconButton, Tooltip, CircularProgress)
- **Lucide React** - Icon set (referenced in root package.json)

### Date/Time
- **dayjs** - Lightweight date manipulation for prayer times

### Image Export
- **html2canvas** and **dom-to-image-more** - Verse sharing as images

### External APIs
- **AlQuran Cloud API** (`api.alquran.cloud/v1/surah/`) - Quran text retrieval
- **Aladhan API** (referenced in PrayerTimes component) - Prayer time calculations based on geolocation

### Font Resources
- Google Fonts: Amiri Quran for Quranic text
- Custom KoGaliModern font family (OTF files in `/fonts/`)