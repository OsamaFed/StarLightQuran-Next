#!/usr/bin/env python3
import os
import shutil
from pathlib import Path

base_path = Path("/workspaces/StarLightQuran-Next/sr/components")

# File mappings
moves = {
    "ui": [
        "DarkModeToggle",
        "LightModeToggle",
        "FontControls",
    ],
    "layout": [
        "PageHeader",
        "OptionCard",
    ],
    "features": [
        "QuranReader",
        "SurahSelector",
        "Verse",
        "VerseCard",
        "VerseSpeedDial",
        "PrayerTimes",
        "SearchResultsList",
    ]
}

print("Moving files to new locations...")

for target_dir, components in moves.items():
    target_path = base_path / target_dir
    target_path.mkdir(parents=True, exist_ok=True)
    
    for component in components:
        # Move .tsx file
        tsx_src = base_path / f"{component}.tsx"
        tsx_dst = target_path / f"{component}.tsx"
        if tsx_src.exists():
            shutil.move(str(tsx_src), str(tsx_dst))
            print(f"✓ Moved {component}.tsx to {target_dir}/")
        
        # Move .module.css file if exists
        css_src = base_path / f"{component}.module.css"
        css_dst = target_path / f"{component}.module.css"
        if css_src.exists():
            shutil.move(str(css_src), str(css_dst))
            print(f"✓ Moved {component}.module.css to {target_dir}/")

print("\nCreating index.ts files...")

# Create index files
indices = {
    "common": [
        "BackToggle",
        "ScrollToTop",
        "SearchInput",
        "Pagination",
        "DecorativeElements",
        "WaqfGuide",
    ],
    "ui": ["DarkModeToggle", "LightModeToggle", "FontControls"],
    "layout": ["PageHeader", "OptionCard"],
    "features": [
        "QuranReader",
        "SurahSelector",
        "Verse",
        "VerseCard",
        "VerseSpeedDial",
        "PrayerTimes",
        "SearchResultsList",
    ]
}

for dir_name, components in indices.items():
    index_path = base_path / dir_name / "index.ts"
    content = "\n".join([f"export {{ default as {comp} }} from './{comp}';" for comp in components])
    
    with open(index_path, "w") as f:
        f.write(content + "\n")
    print(f"✓ Created {dir_name}/index.ts")

# Update root index.ts
root_index = base_path / "index.ts"
root_content = """export * from './common';
export * from './features';
export * from './layout';
export * from './ui';
"""

with open(root_index, "w") as f:
    f.write(root_content)

print("✓ Updated components/index.ts")
print("\n✅ All files reorganized successfully!")
