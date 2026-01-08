#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Create missing static directory to stop warnings
mkdir -p static

# Collect static files
python manage.py collectstatic --no-input

# Run migrations
# Fake core migrations that usually exist in Supabase/Postgres
python manage.py migrate contenttypes --fake
python manage.py migrate auth --fake
python manage.py migrate --fake-initial