#!/bin/sh
set -e  # Configure shell so that if one command fails, it exits
coverage erase
coverage run -m pytest
coverage report
coverage html
coverage xml
