# StarLight Quran

## Overview

StarLight Quran is an Arabic Islamic web application providing Quran reading, Adhkar (remembrances), Duas (supplications), and prayer times functionality. The app is built with Next.js 16 using the App Router pattern, featuring a rich UI with animations, dark/light theme support, and RTL (right-to-left) Arabic text rendering.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **Next.js 16** with App Router (`app/` directory structure)
- **React 19** for component rendering
- **TypeScript** for type safety throughout the codebase

### Styling Approach
- **CSS Modules** for component-scoped styling (`.module.css` files)
- **Tailwind CSS v4** with PostCSS integration
- **CSS Custom Properties** for theming (light/dark mode variables)
- Global styles defined in `app/globals.css` with custom font imports

### Animation Libraries
- **Framer Motion** for React component animations and transitions
- **GSAP** for advanced timeline-based animations
- **OGL** (WebGL library) for the Aurora background effect

### UI Component Library
- **Material UI (MUI) v7** for icons and some UI primitives (IconButton, Tooltip, CircularProgress)
- **Emotion** for MUI's styling engine

### State Management
- React hooks (`useState`, `useEffect`, `useCallback`) for local state
- Custom hooks pattern in `hooks/` directory:
  - `useTheme` - dark/light mode with localStorage persistence
  - `useQuran` - Quran data fetching and pagination logic
  - `useScrollRestoration` - disabled per minimal localStorage policy

### Data Architecture
- **Static JSON data** in `data/` directory for adhkar content
- **External API integration** with AlQuran Cloud API (`api.alquran.cloud`) for Quran verses
- **Aladhan API** for prayer times (based on geolocation)
- **Internal API routes** under `app/api/` serving categorized adhkar data

### Component Organization
Components follow a clear hierarchy in `components/`:
- `common/` - Reusable utilities (BackToggle, ScrollToTop, SearchInput, Pagination, WaqfGuide)
- `features/` - Domain-specific components (SurahSelector, Verse, VerseCard, PrayerTimes)
- `layout/` - Page structure components (PageHeader, OptionCard)
- `ui/` - Visual/interactive elements (Aurora, DarkModeToggle, FontControls)

Each directory exports via `index.ts` for clean imports.

### Routing Structure
- `/` - Home page with navigation cards
- `/mushaf` - Quran reader with verse display
- `/azkar` - Adhkar categories listing
- `/azkar/sabah` - Morning adhkar
- `/azkar/masa` - Evening adhkar
- `/azkar/[category]` - Dynamic category pages
- `/duas` - Duas listing
- `/duas/[category]` - Dynamic dua category pages

### Key Features
- **Quran Reader**: Paginated verse display with tafseer loading, font size controls, and sharing capabilities
- **Prayer Times**: Geolocation-based prayer time calculation with countdown to next prayer
- **Theme System**: Dark/light mode with smooth transitions and theme-aware components
- **Image Export**: html2canvas integration for saving verses as images

## External Dependencies

### Third-Party APIs
- **AlQuran Cloud API** (`https://api.alquran.cloud/v1/`) - Quran text and tafseer data
- **Aladhan API** (referenced in PrayerTimes component) - Islamic prayer time calculations

### NPM Packages (Key)
- `next` v16.0.7 - Framework
- `react` / `react-dom` v19.2.0 - UI library
- `@mui/material` / `@mui/icons-material` v7.3.6 - UI components
- `framer-motion` v12 - Animations
- `gsap` v3.14.2 - Advanced animations
- `ogl` v1.0.11 - WebGL for Aurora effect
- `dayjs` v1.11.19 - Date/time handling
- `html2canvas` v1.4.1 - DOM to image capture
- `dom-to-image-more` v2.9.0 - Alternative image capture

### Static Assets
- Custom Arabic fonts (KoGaliModern family) loaded from `/fonts/`
- Audio files for adhkar in `/audio/`
- Google Fonts integration for Amiri Quran font

### Development Configuration
- Development server runs on port 5000 with host 0.0.0.0 for Replit compatibility
- ESLint with Next.js config
- TypeScript with strict mode enabled