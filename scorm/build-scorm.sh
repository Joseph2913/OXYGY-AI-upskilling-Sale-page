#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Build SCORM 1.2 package — Level 1: Prompt Engineering Essentials
# V2.0
#
# Usage:  ./build-scorm.sh
# Output: /scorm/dist/oxygy-l1-prompt-engineering-scorm.zip
#
# The ZIP places imsmanifest.xml at the root level (SCORM 1.2 requirement).
# Excludes local testing files: index-local.html, scorm-simulator.js, vercel.json
# ═══════════════════════════════════════════════════════════════

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE_DIR="$SCRIPT_DIR/level-1-prompt-engineering"
DIST_DIR="$SCRIPT_DIR/dist"
ZIP_NAME="oxygy-l1-prompt-engineering-scorm.zip"

echo "════════════════════════════════════════════════"
echo "  SCORM 1.2 Build — Level 1: Prompt Engineering"
echo "  Version 2.0"
echo "════════════════════════════════════════════════"
echo ""

# ─── Step 1: Clean dist directory ───
echo "[1/4] Cleaning dist directory..."
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# ─── Step 2: Verify source files exist ───
echo "[2/4] Verifying source files..."
REQUIRED_FILES=(
  "imsmanifest.xml"
  "index.html"
  "css/course.css"
  "css/interactions.css"
  "js/course.js"
  "js/scorm-api.js"
  "js/drag-drop.js"
  "js/card-flip.js"
  "js/spectrum-slider.js"
  "js/quiz-engine.js"
  "assets/logo.png"
)

for f in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$SOURCE_DIR/$f" ]; then
    echo "  ERROR: Missing required file: $f"
    exit 1
  fi
  echo "  OK: $f"
done

# ─── Step 3: Create ZIP (only production files) ───
echo "[3/4] Creating ZIP package..."
cd "$SOURCE_DIR"
zip -r "$DIST_DIR/$ZIP_NAME" \
  imsmanifest.xml \
  index.html \
  css/course.css \
  css/interactions.css \
  js/course.js \
  js/scorm-api.js \
  js/drag-drop.js \
  js/card-flip.js \
  js/spectrum-slider.js \
  js/quiz-engine.js \
  assets/logo.png \
  -x "*.DS_Store"

echo ""

# ─── Step 4: Validate ZIP contents ───
echo "[4/4] Validating ZIP contents..."
echo ""

# Check that imsmanifest.xml is at the root
if unzip -l "$DIST_DIR/$ZIP_NAME" | grep -q "^.*imsmanifest.xml$"; then
  echo "  OK: imsmanifest.xml is at ZIP root"
else
  echo "  ERROR: imsmanifest.xml not found at ZIP root!"
  exit 1
fi

# Check that excluded files are NOT present
EXCLUDED_FILES=("index-local.html" "scorm-simulator.js" "vercel.json" "build-scorm.sh")
for f in "${EXCLUDED_FILES[@]}"; do
  if unzip -l "$DIST_DIR/$ZIP_NAME" | grep -q "$f"; then
    echo "  ERROR: Excluded file found in ZIP: $f"
    exit 1
  fi
  echo "  OK: $f correctly excluded"
done

echo ""
echo "════════════════════════════════════════════════"
echo "  BUILD SUCCESSFUL"
echo "════════════════════════════════════════════════"
echo ""
echo "  Output: $DIST_DIR/$ZIP_NAME"
echo "  Size:   $(du -h "$DIST_DIR/$ZIP_NAME" | cut -f1)"
echo ""
echo "  ZIP contents:"
unzip -l "$DIST_DIR/$ZIP_NAME"
echo ""
echo "  Ready to upload to any SCORM 1.2 LMS."
echo "  (Cornerstone, Workday Learning, Moodle, TalentLMS, etc.)"
