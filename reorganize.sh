#!/bin/bash

COMP_DIR="/workspaces/StarLightQuran-Next/sr/components"

# Step 1: Copy common components to common/ subdirectory
echo "Copying common components to common/ subdirectory..."
cp "$COMP_DIR/BackToggle.tsx" "$COMP_DIR/BackToggle.module.css" "$COMP_DIR/common/"
cp "$COMP_DIR/ScrollToTop.tsx" "$COMP_DIR/ScrollToTop.module.css" "$COMP_DIR/common/"
cp "$COMP_DIR/SearchInput.tsx" "$COMP_DIR/SearchInput.module.css" "$COMP_DIR/common/"
cp "$COMP_DIR/Pagination.tsx" "$COMP_DIR/Pagination.module.css" "$COMP_DIR/common/"
cp "$COMP_DIR/DecorativeElements.tsx" "$COMP_DIR/DecorativeElements.module.css" "$COMP_DIR/common/"
cp "$COMP_DIR/WaqfGuide.tsx" "$COMP_DIR/WaqfGuide.module.css" "$COMP_DIR/common/"

echo "✓ Copied common components"

# Step 2: Delete feature files from root
echo "Deleting feature files from root..."
rm -f "$COMP_DIR/QuranReader.tsx" "$COMP_DIR/QuranReader.module.css"
rm -f "$COMP_DIR/SurahSelector.tsx" "$COMP_DIR/SurahSelector.module.css"
rm -f "$COMP_DIR/Verse.tsx" "$COMP_DIR/Verse.module.css"
rm -f "$COMP_DIR/VerseCard.tsx" "$COMP_DIR/VerseCard.module.css"
rm -f "$COMP_DIR/VerseSpeedDial.tsx"
rm -f "$COMP_DIR/PrayerTimes.tsx" "$COMP_DIR/PrayerTimes.module.css"
rm -f "$COMP_DIR/SearchResultsList.tsx"

echo "✓ Deleted feature files from root"

# Step 3: Delete common components from root
echo "Deleting common components from root..."
rm -f "$COMP_DIR/BackToggle.tsx" "$COMP_DIR/BackToggle.module.css"
rm -f "$COMP_DIR/ScrollToTop.tsx" "$COMP_DIR/ScrollToTop.module.css"
rm -f "$COMP_DIR/SearchInput.tsx" "$COMP_DIR/SearchInput.module.css"
rm -f "$COMP_DIR/Pagination.tsx" "$COMP_DIR/Pagination.module.css"
rm -f "$COMP_DIR/DecorativeElements.tsx" "$COMP_DIR/DecorativeElements.module.css"
rm -f "$COMP_DIR/WaqfGuide.tsx" "$COMP_DIR/WaqfGuide.module.css"

echo "✓ Deleted common components from root"

# Step 4: Delete UI components from root
echo "Deleting UI components from root..."
rm -f "$COMP_DIR/DarkModeToggle.tsx" "$COMP_DIR/DarkModeToggle.module.css"
rm -f "$COMP_DIR/LightModeToggle.tsx" "$COMP_DIR/LightModeToggle.module.css"
rm -f "$COMP_DIR/FontControls.tsx" "$COMP_DIR/FontControls.module.css"

echo "✓ Deleted UI components from root"

# Step 5: Delete layout components from root
echo "Deleting layout components from root..."
rm -f "$COMP_DIR/PageHeader.tsx" "$COMP_DIR/PageHeader.module.css"
rm -f "$COMP_DIR/OptionCard.tsx" "$COMP_DIR/OptionCard.module.css"

echo "✓ Deleted layout components from root"

# Step 6: Verify final structure
echo ""
echo "Final structure of components root directory:"
ls -la "$COMP_DIR" | grep -v "^d" | grep -v "^total"

echo ""
echo "✓ Component reorganization complete!"
