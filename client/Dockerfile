# pull official base image
FROM node:12.18.3-alpine

# set node_modules directory
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
