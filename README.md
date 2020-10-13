# Taxi App

[![Build Status](https://travis-ci.com/ajithpmohan/taxi-app.svg?branch=master)](https://travis-ci.com/ajithpmohan/taxi-app) [![codecov](https://codecov.io/gh/ajithpmohan/taxi-app/branch/master/graph/badge.svg)](https://codecov.io/gh/ajithpmohan/taxi-app)

## Tech Stack

* Docker
* Django Rest Framework
* Django Channel
* React.js & Redux
* Cypress for react.js e2e testing
* PyTest for django testing
* PostgreSQL
* Swagger

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

## Access the services in the development mode.

Open [http://localhost:3001/](http://localhost:3001/) to access `client` service in the browser.

Open [http://localhost:8100/swagger/](http://localhost:8100/swagger/) to access `server` service in the browser.

## Run React.js Code Linter

    docker-compose exec client npm run lint

## Run React.js E2E Testing using Cypress

    docker-compose -f cy-run.yml run e2e

## Run Python Code Linter & Formatter

    docker-compose -f pre-commit.yml up --build

## Run Django Coverage Report

    docker-compose exec server ./coverage.sh
