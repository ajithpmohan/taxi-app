# pull official base image
FROM node:lts-slim

# Set the working directory
ENV APP_DIR=/home/app
RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH $APP_DIR/node_modules/.bin:$PATH

RUN npm install -g npm@latest

# install app dependencies
COPY package.json ./
RUN npm ---legacy-peer-deps i --loglevel=warn \
    && npm cache clean --force

RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache

# Copies everything over to Docker environment
COPY . $APP_DIR

# Finally runs the application
CMD ["npm", "start"]
