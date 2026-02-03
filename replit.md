# StarLight Quran

## Overview

StarLight Quran is an Islamic web application built with Next.js 16 that provides a comprehensive Quran reader experience along with daily adhkar (remembrances) and duas (supplications). The app features Arabic RTL support, beautiful glassmorphism UI with light/dark themes, and smooth GSAP animations throughout.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: CSS Modules with Tailwind CSS integration, custom CSS variables for theming
- **Animations**: GSAP for complex animations, Framer Motion for component transitions
- **UI Components**: Material UI (MUI) for icons and some components, custom glassmorphism components
- **WebGL Effects**: OGL library for Aurora and Iridescence background effects

### Application Structure
- **App Router**: Uses Next.js 16 App Router with pages in `/app` directory
- **Component Organization**: 
  - `/components/common` - Reusable components (BackToggle, Pagination, ScrollToTop, SearchInput, WaqfGuide)
  - `/components/features` - Feature-specific components (SurahSelector, VerseCard, PrayerTimes, etc.)
  - `/components/layout` - Layout components (PageHeader, OptionCard)
  - `/components/ui` - UI elements (LightModeToggle, FontControls, Aurora, Iridescence)

### Data Management
- **State Management**: React hooks (useState, useEffect, useCallback) with custom hooks
- **Custom Hooks**: 
  - `useTheme` - Dark/light mode with localStorage persistence via usehooks-ts
  - `useQuran` - Surah loading and pagination logic
  - `useSearch` - Search with debounce functionality
- **Data Sources**: 
  - Local JSON files for adhkar data (`/data/adhkar.json`)
  - Static TypeScript files for surah metadata (`/data/surahs.ts`)
  - External Quran API (api.alquran.cloud) for verse content and tafseer

### API Routes
- `/api/adhkar/sabah` - Morning adhkar
- `/api/adhkar/masa` - Evening adhkar
- `/api/adhkar/general` - General adhkar categories
- `/api/duas` - Duas collection

### Theming System
- CSS custom properties for colors, spacing, and effects
- Light/dark mode toggle with body class switching
- Glassmorphism effects using backdrop-filter
- Custom Arabic font (KoGaliModern) with multiple weights

### Key Features
- Quran reader with surah selection, verse pagination, and tafseer
- Verse favorites system with localStorage persistence
- Morning/evening adhkar with categorization
- Prayer times with geolocation
- Verse of the day feature
- Font size controls for accessibility
- Share/copy/save verse functionality

## External Dependencies

### Third-Party APIs
- **Quran API**: `api.alquran.cloud` - Fetches surah content, verses, and tafseer
- **Prayer Times API**: Aladhan API (implied by PrayerTimes component with geolocation)

### Key NPM Packages
- `@mui/material` & `@mui/icons-material` - Material UI components and icons
- `@emotion/react` & `@emotion/styled` - Styling for MUI
- `framer-motion` - Animation library
- `gsap` - Advanced animations
- `ogl` - WebGL rendering for background effects
- `dayjs` - Date/time manipulation
- `html2canvas` - Screenshot functionality for verse sharing
- `usehooks-ts` - Utility hooks (useLocalStorage, useDebounce)

### Fonts
- Google Fonts: Amiri Quran (Arabic Quranic text)
- Custom: KoGaliModern (multiple weights, stored in `/public/fonts`)