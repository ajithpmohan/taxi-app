#!/bin/sh

python manage.py flush --no-input
python manage.py migrate
python manage.py loaddata users.json groups.json
python manage.py loaddata admin_interface_theme_bootstrap.json \
    admin_interface_theme_foundation.json admin_interface_theme_uswds.json

exec "$@"
