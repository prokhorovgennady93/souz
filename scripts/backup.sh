#!/bin/bash

# =========================================================
# Dopog ADR - Automated SQLite Database Backup Script
# Schedule this script via Cron (e.g. hourly)
# 0 * * * * /path/to/dopog/scripts/backup.sh >> /var/log/dopog_backup.log 2>&1
# =========================================================

# Paths
APP_DIR="/root/dopog" # Adjust this to the absolute root of your project
DB_PATH="$APP_DIR/prisma/prod.db"
BACKUP_DIR="$APP_DIR/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/prod_$TIMESTAMP.db"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

# Check if SQLite database exists
if [ ! -f "$DB_PATH" ]; then
    echo "[$TIMESTAMP] ERROR: Database file not found at $DB_PATH!"
    exit 1
fi

echo "[$TIMESTAMP] Starting database backup..."

# Perform safe SQLite backup to prevent lock conflicts during high concurrent B2B traffic
sqlite3 "$DB_PATH" ".backup '$BACKUP_FILE'"

if [ $? -eq 0 ]; then
    echo "[$TIMESTAMP] SUCCESS: Database backed up to $BACKUP_FILE"
    
    # Optional: Keep only the last 168 backups (7 days of hourly backups)
    ls -t "$BACKUP_DIR"/prod_*.db | tail -n +169 | xargs -r rm --
    echo "[$TIMESTAMP] Backup rotation applied. Old backups removed."
else
    echo "[$TIMESTAMP] ERROR: Backup failed!"
    exit 1
fi
