#!/bin/bash

# Translate folders in specified directory, supports excluding specific directories
# Usage: ./scripts/translate_with_exclude.sh INPUT_DIR OUTPUT_DIR API_KEY [API_TYPE] [EXCLUDE_DIRS...]

if [ $# -lt 3 ]; then
    echo "Usage: $0 INPUT_DIR OUTPUT_DIR API_KEY [API_TYPE] [EXCLUDE_DIRS...]"
    echo "Example: $0 docs/en/preview docs/zh/preview YOUR_API_KEY deepseek cli release_notes"
    exit 1
fi

INPUT_DIR="$1"
OUTPUT_DIR="$2"
API_KEY="$3"
API_TYPE="${4:-deepseek}"

# Starting from the 5th parameter are directories to exclude
shift 4
EXCLUDE_DIRS=("$@")

echo "Input directory: $INPUT_DIR"
echo "Output directory: $OUTPUT_DIR"
echo "API type: $API_TYPE"
echo "Excluded directories: ${EXCLUDE_DIRS[*]}"

# Check if input directory exists
if [ ! -d "$INPUT_DIR" ]; then
    echo "Error: Input directory does not exist: $INPUT_DIR"
    exit 1
fi

# Install dependencies
echo "Installing Python dependencies..."
python3 -m venv myenv
source myenv/bin/activate
pip install -r scripts/python/requirements.txt --upgrade

# Get all subdirectories
echo "Scanning directory: $INPUT_DIR"
DIRS_TO_TRANSLATE=()

for dir in "$INPUT_DIR"/*; do
    if [ -d "$dir" ]; then
        dir_name=$(basename "$dir")

        # Check if in exclusion list
        exclude=false
        for exclude_dir in "${EXCLUDE_DIRS[@]}"; do
            if [ "$dir_name" = "$exclude_dir" ]; then
                exclude=true
                break
            fi
        done

        if [ "$exclude" = false ]; then
            DIRS_TO_TRANSLATE+=("$dir_name")
        else
            echo "Skipping directory: $dir_name"
        fi
    fi
done

echo "Found ${#DIRS_TO_TRANSLATE[@]} directories to translate:"
printf '%s\n' "${DIRS_TO_TRANSLATE[@]}"

# Translate each directory
for dir_name in "${DIRS_TO_TRANSLATE[@]}"; do
    input_dir="$INPUT_DIR/$dir_name"
    output_dir="$OUTPUT_DIR/$dir_name"

    echo ""
    echo "================================"
    echo "Translating directory: $dir_name"
    echo "Input: $input_dir"
    echo "Output: $output_dir"
    echo "================================"

    python3 scripts/python/transalate_mdx.py \
        --input "$input_dir" \
        --output "$output_dir" \
        --api-key "$API_KEY" \
        --api-type "$API_TYPE" \
        --glossary "scripts/python/glossary.json"

    if [ $? -eq 0 ]; then
        echo "✅ $dir_name translation completed"
    else
        echo "❌ $dir_name translation failed"
    fi
done

echo ""
echo "🎉 All directories translation completed!"
echo "Translated files saved to: $OUTPUT_DIR"