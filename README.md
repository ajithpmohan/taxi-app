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

## Environment Variables

Add your REACT_APP_GOOGLE_API_KEY inside client/.env.development file.

## Usage

Download the repository:

    git clone git@github.com:ajithpmohan/taxi-app.git

## Build the Services

    docker-compose build

## Starting App

    docker-compose up -d

## Access the services in the development mode.

Open [http://localhost:3100/](http://localhost:3100/) to access `client` service in the browser.

Open [http://localhost:8100/](http://localhost:8100/) to access `server` service in the browser.

## Run React.js Code Linter & Formatter

    docker-compose exec client npm run lint

    docker-compose exec client npm run format

## Run Python Code Linter & Formatter

    docker-compose -f pre-commit.yml up --build

## Build & Run React.js E2E Testing using Cypress

    docker-compose -f docker-compose-e2e.yml build cy-run

    docker-compose -f docker-compose-e2e.yml run cy-run

## Run Django Coverage Report

    docker-compose exec server ./coverage.sh
