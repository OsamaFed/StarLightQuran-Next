#!/bin/bash
set -e

cd /workspaces/StarLightQuran-Next/sr

# Create new directory structure
echo "Creating new directory structure..."
mkdir -p components/common
mkdir -p components/features
mkdir -p components/layout
mkdir -p components/ui
mkdir -p styles

# Move common/reusable components
echo "Moving common components..."
mv components/BackToggle.tsx components/common/ 2>/dev/null || true
mv components/BackToggle.module.css components/common/ 2>/dev/null || true
mv components/ScrollToTop.tsx components/common/ 2>/dev/null || true
mv components/ScrollToTop.module.css components/common/ 2>/dev/null || true
mv components/SearchInput.tsx components/common/ 2>/dev/null || true
mv components/SearchInput.module.css components/common/ 2>/dev/null || true
mv components/Pagination.tsx components/common/ 2>/dev/null || true
mv components/Pagination.module.css components/common/ 2>/dev/null || true
mv components/DecorativeElements.tsx components/common/ 2>/dev/null || true
mv components/DecorativeElements.module.css components/common/ 2>/dev/null || true
mv components/WaqfGuide.tsx components/common/ 2>/dev/null || true
mv components/WaqfGuide.module.css components/common/ 2>/dev/null || true

# Move UI toggle components
echo "Moving UI components..."
mv components/DarkModeToggle.tsx components/ui/ 2>/dev/null || true
mv components/DarkModeToggle.module.css components/ui/ 2>/dev/null || true
mv components/LightModeToggle.tsx components/ui/ 2>/dev/null || true
mv components/LightModeToggle.module.css components/ui/ 2>/dev/null || true
mv components/FontControls.tsx components/ui/ 2>/dev/null || true
mv components/FontControls.module.css components/ui/ 2>/dev/null || true

# Move layout components
echo "Moving layout components..."
mv components/PageHeader.tsx components/layout/ 2>/dev/null || true
mv components/PageHeader.module.css components/layout/ 2>/dev/null || true
mv components/OptionCard.tsx components/layout/ 2>/dev/null || true
mv components/OptionCard.module.css components/layout/ 2>/dev/null || true

# Move feature-specific components
echo "Moving feature components..."
mv components/QuranReader.tsx components/features/ 2>/dev/null || true
mv components/QuranReader.module.css components/features/ 2>/dev/null || true
mv components/SurahSelector.tsx components/features/ 2>/dev/null || true
mv components/SurahSelector.module.css components/features/ 2>/dev/null || true
mv components/Verse.tsx components/features/ 2>/dev/null || true
mv components/Verse.module.css components/features/ 2>/dev/null || true
mv components/VerseCard.tsx components/features/ 2>/dev/null || true
mv components/VerseCard.module.css components/features/ 2>/dev/null || true
mv components/VerseSpeedDial.tsx components/features/ 2>/dev/null || true
mv components/PrayerTimes.tsx components/features/ 2>/dev/null || true
mv components/PrayerTimes.module.css components/features/ 2>/dev/null || true
mv components/SearchResultsList.tsx components/features/ 2>/dev/null || true

echo "Restructure complete!"
