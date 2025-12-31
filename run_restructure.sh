#!/bin/bash
set -e

cd "$(dirname "$0")/sr"

echo "=== Starting Component Restructuring ==="
echo ""

# Move COMMON components
echo "Moving COMMON components..."
for file in BackToggle ScrollToTop SearchInput Pagination DecorativeElements WaqfGuide; do
  if [ -f "components/${file}.tsx" ]; then
    mv "components/${file}.tsx" "components/common/" && echo "  ✓ Moved ${file}.tsx"
  fi
  if [ -f "components/${file}.module.css" ]; then
    mv "components/${file}.module.css" "components/common/" && echo "  ✓ Moved ${file}.module.css"
  fi
done

echo ""
echo "Moving UI components..."
for file in DarkModeToggle LightModeToggle FontControls; do
  if [ -f "components/${file}.tsx" ]; then
    mv "components/${file}.tsx" "components/ui/" && echo "  ✓ Moved ${file}.tsx"
  fi
  if [ -f "components/${file}.module.css" ]; then
    mv "components/${file}.module.css" "components/ui/" && echo "  ✓ Moved ${file}.module.css"
  fi
done

echo ""
echo "Moving LAYOUT components..."
for file in PageHeader OptionCard; do
  if [ -f "components/${file}.tsx" ]; then
    mv "components/${file}.tsx" "components/layout/" && echo "  ✓ Moved ${file}.tsx"
  fi
  if [ -f "components/${file}.module.css" ]; then
    mv "components/${file}.module.css" "components/layout/" && echo "  ✓ Moved ${file}.module.css"
  fi
done

echo ""
echo "Moving FEATURES components..."
for file in QuranReader SurahSelector Verse VerseCard PrayerTimes SearchResultsList VerseSpeedDial; do
  if [ -f "components/${file}.tsx" ]; then
    mv "components/${file}.tsx" "components/features/" && echo "  ✓ Moved ${file}.tsx"
  fi
  if [ -f "components/${file}.module.css" ]; then
    mv "components/${file}.module.css" "components/features/" && echo "  ✓ Moved ${file}.module.css"
  fi
done

echo ""
echo "=== Restructuring Complete! ==="
echo ""
echo "New directory structure created:"
echo "  components/"
echo "  ├── common/"
echo "  ├── ui/"
echo "  ├── layout/"
echo "  ├── features/"
echo "  ├── index.ts"
echo "  ├── common/index.ts"
echo "  ├── ui/index.ts"
echo "  ├── layout/index.ts"
echo "  └── features/index.ts"
