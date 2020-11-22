# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /usr/src/app/

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install app dependencies
COPY package*.json ./
RUN npm i && npm cache clean --force

# Copies everything over to Docker environment
COPY . .

# Finally runs the application
CMD npm start
