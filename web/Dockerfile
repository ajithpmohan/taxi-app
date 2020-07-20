# The first instruction is what image we want to base our container on
# We Use an official Python runtime as a parent image
FROM python:3.8.2-alpine

# Set enviroment variables - Prevents Python from writing pyc files to disc
ENV PYTHONDONTWRITEBYTECODE 1

# Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip

# install git dependencies
RUN apk add --update git

# install psycopg2 dependencies
RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev

# install pillow dependencies
RUN apk --no-cache add jpeg-dev zlib-dev freetype-dev lcms2-dev openjpeg-dev \
        tiff-dev tk-dev tcl-dev harfbuzz-dev fribidi-dev

# Set the working directory
WORKDIR /usr/src/web

# Copy the current directory contents into the container
COPY . /usr/src/web/

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# run entrypoint.sh
ENTRYPOINT ["/usr/src/web/entrypoint.sh"]
