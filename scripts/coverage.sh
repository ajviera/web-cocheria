#!/usr/bin/env bash
set -euo pipefail

# ─── Colors ──────────────────────────────────────────────────────────────────
GRN='\033[0;32m'
YLW='\033[1;33m'
RED='\033[0;31m'
CYN='\033[0;36m'
BLD='\033[1m'
DIM='\033[2m'
RST='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LCOV_FILE="$PROJECT_ROOT/coverage/lcov.info"
THRESHOLD=100

# ─── Parse flags ─────────────────────────────────────────────────────────────
SKIP_TESTS=false
for arg in "$@"; do
  case "$arg" in
    --coverage-only) SKIP_TESTS=true ;;
    -h|--help)
      echo "Usage: $0 [--coverage-only]"
      echo "  --coverage-only  Skip running tests; only read existing coverage/lcov.info"
      exit 0 ;;
  esac
done

# ─── Header ──────────────────────────────────────────────────────────────────
echo -e "\n${BLD}══════════════════════════════════════════════════════${RST}"
echo -e "${BLD}   web-cocheria Coverage Runner${RST}"
if $SKIP_TESTS; then
  echo -e "${DIM}   mode: coverage-only (reading existing lcov.info)${RST}"
fi
echo -e "${BLD}══════════════════════════════════════════════════════${RST}\n"

# ─── Run tests ───────────────────────────────────────────────────────────────
run_ok=true
if ! $SKIP_TESTS; then
  echo -e "${CYN}▶ ${BLD}Running tests with coverage…${RST}\n"
  if ! (cd "$PROJECT_ROOT" && npm run test:coverage); then
    run_ok=false
  fi
  echo ""
fi

if ! $run_ok; then
  echo -e "${RED}Tests failed — coverage report unavailable.${RST}"
  exit 1
fi

if [[ ! -f "$LCOV_FILE" ]]; then
  echo -e "${RED}No lcov.info found at $LCOV_FILE${RST}"
  echo -e "${DIM}Run: npm run test:coverage${RST}"
  exit 1
fi

# ─── Parse lcov.info per source file ─────────────────────────────────────────
FILE_NAMES=()
FILE_LF=()
FILE_LH=()
TOTAL_LF=0
TOTAL_LH=0

current_sf=""
current_lf=0
current_lh=0

while IFS= read -r line; do
  case "$line" in
    SF:*)
      raw="${line#SF:}"
      current_sf="${raw#$PROJECT_ROOT/}"
      current_lf=0
      current_lh=0
      ;;
    LF:*)
      current_lf="${line#LF:}"
      ;;
    LH:*)
      current_lh="${line#LH:}"
      ;;
    end_of_record)
      FILE_NAMES+=("$current_sf")
      FILE_LF+=("$current_lf")
      FILE_LH+=("$current_lh")
      TOTAL_LF=$((TOTAL_LF + current_lf))
      TOTAL_LH=$((TOTAL_LH + current_lh))
      ;;
  esac
done < "$LCOV_FILE"

# ─── Helpers ─────────────────────────────────────────────────────────────────
pct_color() {
  local p="$1"
  if   [[ "$p" -ge $THRESHOLD ]]; then echo -n "$GRN"
  elif [[ "$p" -ge 70 ]];         then echo -n "$YLW"
  else                                  echo -n "$RED"
  fi
}

# ─── Summary table ───────────────────────────────────────────────────────────
echo -e "${BLD}══════════════════════════════════════════════════════${RST}"
echo -e "${BLD}   Coverage Summary  ${DIM}(threshold: ${THRESHOLD}%)${RST}"
echo -e "${BLD}══════════════════════════════════════════════════════${RST}"

# Column width: longest filename
max_len=4
for name in "${FILE_NAMES[@]}"; do
  [[ ${#name} -gt $max_len ]] && max_len=${#name}
done
col=$((max_len + 2))

printf "${BLD}%-${col}s  %-8s  %s${RST}\n" "File" "Lines" "Status"
printf '%*s\n' "$((col + 32))" '' | tr ' ' '-'

any_failed=false
for i in "${!FILE_NAMES[@]}"; do
  name="${FILE_NAMES[$i]}"
  lf="${FILE_LF[$i]}"
  lh="${FILE_LH[$i]}"

  if [[ "$lf" -gt 0 ]]; then
    pct_float=$(awk "BEGIN {printf \"%.1f\", $lh * 100 / $lf}")
    pct_int=$(awk "BEGIN {printf \"%d\", $lh * 100 / $lf}")
    color=$(pct_color "$pct_int")

    if [[ "$pct_int" -lt $THRESHOLD ]]; then
      status="${RED}✗ FAIL${RST}"
      any_failed=true
    else
      status="${GRN}✓ PASS${RST}"
    fi

    printf "%-${col}s  ${color}%s%%${RST}  (%d/%d)  %b\n" \
      "$name" "$pct_float" "$lh" "$lf" "$status"
  else
    printf "%-${col}s  ${DIM}—        ${RST}  %b\n" "$name" "${DIM}(no trackable lines)${RST}"
  fi
done

printf '%*s\n' "$((col + 32))" '' | tr ' ' '-'

# Total row
if [[ "$TOTAL_LF" -gt 0 ]]; then
  total_float=$(awk "BEGIN {printf \"%.1f\", $TOTAL_LH * 100 / $TOTAL_LF}")
  total_int=$(awk "BEGIN {printf \"%d\", $TOTAL_LH * 100 / $TOTAL_LF}")
  total_color=$(pct_color "$total_int")
  printf "${BLD}%-${col}s  ${total_color}%s%%${RST}  (%d/%d)${RST}\n" \
    "TOTAL" "$total_float" "$TOTAL_LH" "$TOTAL_LF"
fi

echo ""

# ─── Exit code ───────────────────────────────────────────────────────────────
if $any_failed; then
  echo -e "${RED}${BLD}✗ Some files are below the ${THRESHOLD}% line coverage threshold.${RST}"
  exit 1
else
  echo -e "${GRN}${BLD}✓ All files meet the ${THRESHOLD}% line coverage threshold.${RST}"
fi
