#!/bin/sh
# Backup script for Labour CMS SQLite database
# Usage: ./backup.sh [backup_dir]
# Recommend running via cron: 0 2 * * * /path/to/backup.sh

set -e

DB_PATH="${DB_PATH:-$(dirname "$0")/../data/labour_cms.db}"
BACKUP_DIR="${1:-$(dirname "$0")/../data/backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/labour_cms_$TIMESTAMP.db"

mkdir -p "$BACKUP_DIR"

# Use SQLite's online backup to avoid locking issues
sqlite3 "$DB_PATH" ".backup $BACKUP_FILE"

echo "Backup created: $BACKUP_FILE"

# Remove backups older than 30 days
find "$BACKUP_DIR" -name "*.db" -mtime +30 -delete
echo "Old backups cleaned up"
