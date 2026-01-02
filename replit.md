# StarLight Quran

## Overview
A Next.js web application for Quran reading, Azkar (morning/evening remembrances), and Duas (supplications). The application features Arabic text with custom fonts and a beautiful UI.

## Project Structure
- `sr/` - Main Next.js application directory
  - `app/` - Next.js App Router pages and API routes
  - `components/` - React components organized by type (common, features, layout, ui)
  - `data/` - Static data files (adhkar.json, surahs.ts)
  - `hooks/` - Custom React hooks
  - `lib/` - Utility libraries
  - `public/fonts/` - Custom Arabic fonts (KoGali Modern)
  - `types/` - TypeScript type definitions

## Technology Stack
- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Material UI (MUI)
- Framer Motion for animations

## Development
- Run the dev server: `cd sr && npm run dev`
- Dev server runs on port 5000

## Deployment
- Build: `cd sr && npm run build`
- Start production: `cd sr && npm run start`
- Configured for autoscale deployment on Replit
