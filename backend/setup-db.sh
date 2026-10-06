#!/bin/bash
# Setup PostgreSQL database for Portfolio backend
# Run this script once before starting the backend for the first time

set -e

echo "🗄️  Setting up PostgreSQL database for Portfolio Backend..."

# Load .env if present
if [ -f "$(dirname "$0")/.env" ]; then
  export $(grep -v '^#' "$(dirname "$0")/.env" | xargs)
fi

DB_NAME="${DB_NAME:-portfolio_db}"
DB_USER="${DB_USERNAME:-postgres}"

echo "📌 Database: $DB_NAME"
echo "👤 User: $DB_USER"

# Try to find the postgres superuser socket path
PGHOST=""
if [ -S "/var/run/postgresql/.s.PGSQL.5432" ]; then
  PGHOST="/var/run/postgresql"
fi

create_db() {
  psql -h localhost -U "$DB_USER" -c "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME';" 2>/dev/null | grep -q 1 || \
  psql -h localhost -U "$DB_USER" -c "CREATE DATABASE $DB_NAME;" 2>/dev/null
}

echo ""
echo "Please enter the PostgreSQL password for user '$DB_USER':"
create_db && echo "✅ Database '$DB_NAME' is ready!" || {
  echo ""
  echo "❌ Could not connect automatically."
  echo ""
  echo "📝 Manual setup (run these commands as postgres admin):"
  echo ""
  echo "   sudo -u postgres psql -c \"CREATE DATABASE $DB_NAME;\""
  echo "   sudo -u postgres psql -c \"ALTER USER $DB_USER WITH PASSWORD 'your_password';\""
  echo ""
  echo "Then update backend/.env with your credentials and run: cd backend && mvn spring-boot:run"
}
