# node lts base image
FROM node:12.18.3-alpine

# set node_modules directory
WORKDIR /usr/src/

# install app dependencies
COPY package*.json ./

# Installs all node packages
RUN npm i

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/node_modules/.bin:$PATH

# set app working directory
WORKDIR /usr/src/app/

# Copies everything over to Docker environment
COPY . .

# Finally runs the application
CMD npm start
