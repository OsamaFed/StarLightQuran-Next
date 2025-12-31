#!/usr/bin/env python3

import os
from pathlib import Path

base = Path("/workspaces/StarLightQuran-Next/sr/components")

# Files to delete from root
files_to_delete = [
    "QuranReader.tsx", "QuranReader.module.css",
    "SurahSelector.tsx", "SurahSelector.module.css",
    "Verse.tsx", "Verse.module.css",
    "VerseCard.tsx", "VerseCard.module.css",
    "VerseSpeedDial.tsx",
    "PrayerTimes.tsx", "PrayerTimes.module.css",
    "SearchResultsList.tsx",
    "DarkModeToggle.tsx", "DarkModeToggle.module.css",
    "LightModeToggle.tsx", "LightModeToggle.module.css",
    "FontControls.tsx", "FontControls.module.css",
    "PageHeader.tsx", "PageHeader.module.css",
    "OptionCard.tsx", "OptionCard.module.css",
    "BackToggle.tsx", "BackToggle.module.css",
    "DecorativeElements.tsx", "DecorativeElements.module.css",
    "Pagination.tsx", "Pagination.module.css",
    "ScrollToTop.tsx", "ScrollToTop.module.css",
    "SearchInput.tsx", "SearchInput.module.css",
    "WaqfGuide.tsx", "WaqfGuide.module.css",
]

deleted = []
for file in files_to_delete:
    path = base / file
    if path.exists():
        os.remove(path)
        deleted.append(file)
        print(f"✓ Deleted {file}")

print(f"\n✅ Deleted {len(deleted)} files")
print(f"\nRemaining files in {base}:")
remaining = sorted([f.name for f in base.iterdir() if f.is_file()])
for f in remaining:
    print(f"  - {f}")

print(f"\nSubdirectories:")
for d in sorted([f.name for f in base.iterdir() if f.is_dir()]):
    print(f"  - {d}/")
