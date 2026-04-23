#!/bin/sh

# Use env vars with default fallback
DB_HOST=${DATABASE_HOST:-uil_db}
DB_PORT=${DATABASE_PORT:-3306}

echo "Waiting for database at $DB_HOST:$DB_PORT..."

timeout=100  
counter=0

while ! nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
  counter=$((counter + 1))
  if [ "$counter" -ge "$timeout" ]; then
    echo "❌ Database did not become available in time. Exiting..."
    exit 1
  fi
done

echo "✅ Database is ready!"

echo "🛠 Applying migrations..."
python manage.py migrate --noinput

echo "📦 Collecting static files..."
python manage.py collectstatic --noinput


  if [ "$DJANGO_ENV" = "development" ]; then
    echo "🌱 Development mode: enabling auto-reload"
    exec uvicorn config.asgi:application --host 0.0.0.0 --port 8000 --reload --log-level info
  else
    echo "🚀 Production mode: running Gunicorn with Uvicorn workers"
    # We use Gunicorn as the process manager to scale workers
    exec gunicorn config.asgi:application \
        --workers 4 \
        --worker-class uvicorn.workers.UvicornWorker \
        --bind 0.0.0.0:8000 \
        --log-level info
  fi
