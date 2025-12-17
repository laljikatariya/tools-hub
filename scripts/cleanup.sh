#!/bin/bash

# Cleanup script for temp files
# Run this periodically to clean old temp files

TEMP_DIR="./temp"
MAX_AGE=3600  # 1 hour in seconds

if [ -d "$TEMP_DIR" ]; then
  find "$TEMP_DIR" -type f -mtime +1 -delete
  echo "Cleaned up old temp files"
else
  echo "Temp directory does not exist"
fi