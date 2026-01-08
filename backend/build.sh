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
# Standard migrate command for a clean database
python manage.py migrate
