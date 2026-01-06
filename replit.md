# StarLight Quran

## Overview

StarLight Quran is an Islamic web application that provides a comprehensive Quran reading experience along with prayer times, adhkar (daily remembrances), and duas (supplications). The app is built as a Next.js application with a focus on Arabic RTL (right-to-left) support, featuring an elegant UI with dark/light mode themes and visual effects like aurora backgrounds.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **Next.js 16** with App Router architecture
- **React 19** for component rendering
- **TypeScript** for type safety
- All pages use client-side rendering ("use client" directive)

### Styling Approach
- **CSS Modules** for component-scoped styling
- **Tailwind CSS v4** for utility classes
- **Custom CSS variables** for theming (light/dark mode)
- Custom font family "KoGaliModern" loaded via @font-face
- Arabic "Amiri Quran" font from Google Fonts

### Component Organization
Components are organized into four categories under `sr/components/`:
- `common/` - Reusable utilities (BackToggle, Pagination, ScrollToTop, SearchInput, WaqfGuide)
- `features/` - Domain-specific components (PrayerTimes, SurahSelector, Verse, VerseCard)
- `layout/` - Page structure components (PageHeader, OptionCard)
- `ui/` - UI controls (Aurora, DarkModeToggle, FontControls, LightModeToggle)

### Animation Libraries
- **GSAP** for scroll and entrance animations
- **Framer Motion** for component transitions and micro-interactions
- **OGL** for WebGL aurora background effects (custom shader-based)

### State Management
- React hooks (useState, useEffect, useCallback)
- Custom hooks in `sr/hooks/`:
  - `useTheme` - Dark/light mode with localStorage persistence
  - `useQuran` - Quran data fetching and pagination
  - `useScrollRestoration` - Scroll position management (currently disabled)

### Data Layer
- **External API**: AlQuran Cloud API (`api.alquran.cloud`) for Quran text and tafseer
- **Local JSON**: `sr/data/adhkar.json` for adhkar/duas content
- **Static Data**: `sr/data/surahs.ts` for surah metadata
- **Internal API Routes**: Next.js API routes under `sr/app/api/` for categorized adhkar/duas

### API Route Structure
- `/api/adhkar/sabah` - Morning adhkar
- `/api/adhkar/masa` - Evening adhkar  
- `/api/adhkar/general` - General adhkar
- `/api/duas` - Duas (supplications)

### UI Component Library
- **Material UI (MUI) v7** for icons and some UI components (IconButton, Tooltip, CircularProgress)
- **@emotion/react** and **@emotion/styled** as MUI's styling engine

### RTL Support
- HTML configured with `lang="ar"` and `dir="rtl"`
- All styling accommodates right-to-left text direction

## External Dependencies

### External APIs
- **AlQuran Cloud API** (`https://api.alquran.cloud/v1/`) - Quran text, tafseer, and surah data
- **Aladhan Prayer Times API** (referenced in PrayerTimes component) - Prayer time calculations based on geolocation

### Key NPM Packages
- `next` - React framework
- `react` / `react-dom` - UI library
- `gsap` - Animation library
- `framer-motion` - React animation library
- `ogl` - Minimal WebGL library for aurora effects
- `@mui/material` / `@mui/icons-material` - UI component library
- `dayjs` - Date/time manipulation
- `html2canvas` / `dom-to-image-more` - Screenshot/image export functionality

### Browser APIs Used
- Geolocation API for prayer times
- LocalStorage for theme preference persistence
- Web Share API for verse sharing functionality

### Static Assets
- Custom OpenType fonts in `/fonts/` directory
- Audio files for adhkar playback in `/audio/` directory