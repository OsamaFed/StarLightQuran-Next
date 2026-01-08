# StarLight Quran

## Overview

StarLight Quran is an Arabic Islamic web application built with Next.js that provides Quran reading, Adhkar (remembrances), Duas (supplications), and prayer times functionality. The app features a modern, animated UI with dark/light mode support, RTL (right-to-left) text direction, and a glassmorphism design aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **Next.js 16** with App Router - Chosen for server-side rendering, file-based routing, and built-in API routes
- **React 19** - Latest React version for improved performance
- **TypeScript** - Type safety throughout the codebase

### Styling Approach
- **Tailwind CSS 4** - Utility-first CSS framework
- **CSS Modules** - Component-scoped styles (`.module.css` files)
- **Custom CSS Variables** - Theme system with light/dark mode support
- **Custom Fonts** - KoGaliModern font family and Amiri Quran for Arabic text

### Animation Libraries
- **Framer Motion** - Page transitions and component animations
- **GSAP** - Complex timeline animations on the home page
- **OGL** - WebGL-based Aurora background effect

### UI Components
- **Material UI (MUI)** - Icons and specific UI components (IconButton, Tooltip, CircularProgress)
- **Custom Components** - Extensive custom component library organized by function:
  - `/components/common` - Reusable utilities (BackToggle, ScrollToTop, Pagination, SearchInput)
  - `/components/features` - Feature-specific components (PrayerTimes, Verse, SurahSelector)
  - `/components/layout` - Layout components (PageHeader, OptionCard)
  - `/components/ui` - UI controls (DarkModeToggle, FontControls, Aurora background)

### State Management
- **React Hooks** - Local state with useState, useEffect, useCallback
- **Custom Hooks** - Abstracted logic in `/hooks`:
  - `useTheme` - Dark mode toggle with localStorage persistence
  - `useQuran` - Quran data fetching and pagination
  - `useScrollRestoration` - Scroll position management (currently disabled)

### API Architecture
- **Next.js API Routes** - RESTful endpoints in `/app/api/`:
  - `/api/adhkar/sabah` - Morning remembrances
  - `/api/adhkar/masa` - Evening remembrances
  - `/api/adhkar/general` - General remembrances
  - `/api/duas` - Supplications
- **External API** - AlQuran Cloud API (`api.alquran.cloud`) for Quran text and tafseer

### Data Layer
- **Static JSON** - Local adhkar data in `/data/adhkar.json`
- **TypeScript Data Files** - Surah metadata in `/data/surahs.ts`
- **Utility Functions** - Data categorization in `/lib/categorize-adhkar.ts`

### Routing Structure
- `/` - Home page with navigation cards
- `/mushaf` - Quran reader with verse display
- `/azkar` - Adhkar categories listing
- `/azkar/sabah` - Morning adhkar
- `/azkar/masa` - Evening adhkar
- `/azkar/[category]` - Dynamic category pages
- `/duas` - Duas categories listing
- `/duas/[category]` - Dynamic dua category pages

### Design Patterns
- **Component Composition** - Small, reusable components combined into features
- **Index Exports** - Barrel files (`index.ts`) for clean imports
- **CSS Variables Theming** - Theme switching via CSS custom properties and body class
- **RTL Support** - HTML dir="rtl" with Arabic-first design

## External Dependencies

### NPM Packages
- **@mui/material & @mui/icons-material** - Material Design components and icons
- **@emotion/react & @emotion/styled** - MUI styling dependencies
- **framer-motion** - Animation library
- **gsap** - GreenSock animation platform
- **ogl** - WebGL library for Aurora effect
- **dayjs** - Date/time handling for prayer times
- **html2canvas & dom-to-image-more** - Screenshot/sharing functionality

### External APIs
- **AlQuran Cloud API** (`https://api.alquran.cloud/v1/`) - Quran text data and tafseer
- **Aladhan API** (implied in PrayerTimes component) - Prayer times based on geolocation

### Fonts
- **Google Fonts** - Amiri Quran (via CSS import)
- **Custom Fonts** - KoGaliModern family (local OTF files in `/public/fonts/`)

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **PostCSS** - Tailwind CSS processing