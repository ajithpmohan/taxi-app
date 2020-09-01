#!/bin/sh
set -e  # Configure shell so that if one command fails, it exits
coverage erase
coverage run manage.py test apps
coverage report
coverage html
coverage xml
