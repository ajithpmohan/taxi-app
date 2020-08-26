# Taxi App built on Docker, DRF & React.js

[![Build Status](https://travis-ci.com/ajithpmohan/taxi-app.svg?branch=master)](https://travis-ci.com/ajithpmohan/taxi-app)

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
Before building the services update the file permission of `server/entrypoint.sh`

    chmod +x server/entrypoint.sh

## Build the Services

    docker-compose build

## Starting App

    docker-compose up -d

## Swagger for Server service
Access it through [http://0.0.0.0:8100/swagger/](http://0.0.0.0:8100/swagger/)

## React.js E2E testing using cypress

    docker-compose exec client npm run e2e

## Python Code Styling

Before code pushing, run [flake8](https://simpleisbetterthancomplex.com/packages/2016/08/05/flake8.html) for code styling and [isort](https://simpleisbetterthancomplex.com/packages/2016/10/08/isort.html) for organizing the python imports.

    docker-compose exec server flake8
    docker-compose exec server isort -rc .
