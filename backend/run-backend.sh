#!/bin/bash
set -e

# Load .env if present
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

if [ -f "$ENV_FILE" ]; then
  set -a
  source "$ENV_FILE"
  set +a
  echo "✅ Loaded configuration from .env"
fi

echo ""
echo "🚀 Starting Portfolio Spring Boot Backend..."
echo "   📊 Database : ${DB_USERNAME:-postgres}@${DB_HOST:-localhost}:${DB_PORT:-5437}/${DB_NAME:-portfolio_db}"
echo "   🌐 API Port : ${PORT:-8080}"
echo ""

cd "$SCRIPT_DIR"
mvn spring-boot:run \
  -Dspring-boot.run.jvmArguments="\
    -DDB_HOST=${DB_HOST:-localhost} \
    -DDB_PORT=${DB_PORT:-5437} \
    -DDB_NAME=${DB_NAME:-portfolio_db} \
    -DDB_USERNAME=${DB_USERNAME:-postgres} \
    -DDB_PASSWORD=${DB_PASSWORD:-postgrespassword} \
    -DJWT_SECRET=${JWT_SECRET:-404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970} \
    -DPORT=${PORT:-8080} \
    -DADMIN_USERNAME=${ADMIN_USERNAME:-admin} \
    -DADMIN_PASSWORD=${ADMIN_PASSWORD:-admin123} \
    -DADMIN_EMAIL=${ADMIN_EMAIL:-admin@portfolio.local} \
    -DUPLOAD_DIR=${UPLOAD_DIR:-uploads}"
