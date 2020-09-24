# Taxi App built on Docker, DRF & React.js

[![Build Status](https://travis-ci.com/ajithpmohan/taxi-app.svg?branch=master)](https://travis-ci.com/ajithpmohan/taxi-app) [![codecov](https://codecov.io/gh/ajithpmohan/taxi-app/branch/master/graph/badge.svg)](https://codecov.io/gh/ajithpmohan/taxi-app)

## Features

* Docker
* Django Rest Framework
* Django Channel
* React.js & Redux
* Cypress for react.js e2e testing
* PostgreSQL
* Redis

## System Requirements

You need **Docker Engine** and **Docker Compose**. Install it from [Docker Website](https://docs.docker.com/)

## Usage

Download the repository:

    git clone git@github.com:ajithpmohan/taxi-app.git

## Permission Required

Before building the services update the permission of following bash scripts.

    chmod +x server/coverage.sh server/entrypoint.sh server/entrypoint.prod.sh

## Build the Services

    docker-compose build

## Starting App

    docker-compose up -d

## Swagger for Django (backend) Service

Access it through [http://0.0.0.0:8100/swagger/](http://0.0.0.0:8100/swagger/)

## Run React.js Code Linter

    docker-compose exec client npm run e2e

## Run React.js E2E Testing using Cypress

    docker-compose -f cy-run.yml run e2e

## Build & Run Django Code Linter

    docker-compose -f pre-commit.yml up --build

## Create Django Coverage Report

    docker-compose exec server ./coverage.sh
