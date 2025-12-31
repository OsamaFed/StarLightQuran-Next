#!/bin/bash

set -e

cd /workspaces/StarLightQuran-Next/sr/components

# Remove feature components from root
rm -f QuranReader.tsx QuranReader.module.css
rm -f SurahSelector.tsx SurahSelector.module.css
rm -f Verse.tsx Verse.module.css
rm -f VerseCard.tsx VerseCard.module.css
rm -f VerseSpeedDial.tsx
rm -f PrayerTimes.tsx PrayerTimes.module.css
rm -f SearchResultsList.tsx

# Remove UI components from root
rm -f DarkModeToggle.tsx DarkModeToggle.module.css
rm -f LightModeToggle.tsx LightModeToggle.module.css
rm -f FontControls.tsx FontControls.module.css

# Remove layout components from root
rm -f PageHeader.tsx PageHeader.module.css
rm -f OptionCard.tsx OptionCard.module.css

# Remove remaining common components from root (already in common/)
rm -f BackToggle.tsx BackToggle.module.css
rm -f DecorativeElements.tsx DecorativeElements.module.css
rm -f Pagination.tsx Pagination.module.css
rm -f ScrollToTop.tsx ScrollToTop.module.css
rm -f SearchInput.tsx SearchInput.module.css
rm -f WaqfGuide.tsx WaqfGuide.module.css

echo "Cleanup complete!"
ls -la
