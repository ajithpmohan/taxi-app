# The first instruction is what image we want to base our container on
# We Use an official Python runtime as a parent image
FROM python:3.8.2-alpine

# Set enviroment variables - Prevents Python from writing pyc files to disc
ENV PYTHONDONTWRITEBYTECODE 1

# Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED 1

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
WORKDIR $BASE_DIR

ENV ASSETS_DIR=/usr/src/assets
RUN mkdir $ASSETS_DIR
RUN mkdir $ASSETS_DIR/staticfiles
RUN mkdir $ASSETS_DIR/mediafiles

# Copies everything over to Docker environment
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
