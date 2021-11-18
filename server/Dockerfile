# pull official base image
FROM python:3.10-slim

# Set the working directory
ENV BASE_DIR=/home/app
ENV APP_HOME=$BASE_DIR/web
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

# create assets directory
ENV ASSETS_HOME=$BASE_DIR/assets
RUN mkdir -p $ASSETS_HOME/staticfiles && mkdir $ASSETS_HOME/mediafiles

# Set enviroment variables - Prevents Python from writing pyc files to disc
ENV PYTHONDONTWRITEBYTECODE 1

# Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-client gcc python3-dev libpq-dev

RUN pip install --upgrade pip

# install python dependencies
COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g' $APP_HOME/entrypoint.sh
RUN chmod +x $APP_HOME/entrypoint.sh

# Copies everything over to Docker environment
COPY . $APP_HOME

# run entrypoint.sh
ENTRYPOINT ["/home/app/web/entrypoint.sh"]
