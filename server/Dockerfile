# The first instruction is what image we want to base our container on
# We Use an official Python runtime as a parent image
FROM python:3.8.2-alpine

# Set enviroment variables - Prevents Python from writing pyc files to disc
ENV PYTHONDONTWRITEBYTECODE 1

# Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED 1

# install git dependencies
RUN apk add --update git

# install psycopg2, pillow & cryptography
RUN apk add --no-cache --upgrade --virtual build-deps \
    alpine-sdk \
    postgresql-dev \
    libffi-dev openssl-dev \
    && pip install --no-cache-dir --upgrade pip \
    && apk add postgresql-client \
    && pip install --no-cache-dir psycopg2 \
    && apk add jpeg-dev zlib-dev libjpeg \
    && pip install --no-cache-dir Pillow \
    && pip install --no-cache-dir greenlet twisted hiredis cryptography \
    && apk del build-deps

# Set the working directory
ENV BASE_DIR=/usr/src/app
ENV APP_DIR=$BASE_DIR/web
RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

# Set assets directory
ENV ASSETS_DIR=$BASE_DIR/assets
RUN mkdir -p $ASSETS_DIR
RUN mkdir $ASSETS_DIR/staticfiles
RUN mkdir $ASSETS_DIR/mediafiles

# Copies everything over to Docker environment
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/web/entrypoint.sh"]
