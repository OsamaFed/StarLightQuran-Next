#!/bin/bash

set -e

cd /workspaces/StarLightQuran-Next/sr

# Create the barrel index files

# Create common/index.ts
cat > components/common/index.ts << 'EOF'
export { default as BackToggle } from './BackToggle';
export { default as ScrollToTop } from './ScrollToTop';
export { default as SearchInput } from './SearchInput';
export { default as Pagination } from './Pagination';
export { default as DecorativeElements } from './DecorativeElements';
export { default as WaqfGuide } from './WaqfGuide';
EOF

# Create ui/index.ts
cat > components/ui/index.ts << 'EOF'
export { default as DarkModeToggle } from './DarkModeToggle';
export { default as LightModeToggle } from './LightModeToggle';
export { default as FontControls } from './FontControls';
EOF

# Create layout/index.ts
cat > components/layout/index.ts << 'EOF'
export { default as PageHeader } from './PageHeader';
export { default as OptionCard } from './OptionCard';
EOF

# Create features/index.ts
cat > components/features/index.ts << 'EOF'
export { default as QuranReader } from './QuranReader';
export { default as SurahSelector } from './SurahSelector';
export { default as Verse } from './Verse';
export { default as VerseCard } from './VerseCard';
export { default as VerseSpeedDial } from './VerseSpeedDial';
export { default as PrayerTimes } from './PrayerTimes';
export { default as SearchResultsList } from './SearchResultsList';
EOF

echo "Index files created!"
