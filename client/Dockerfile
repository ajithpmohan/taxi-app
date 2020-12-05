# pull official base image
FROM node:14.15.1-alpine

# Set the working directory
ENV BASE_DIR=/usr/src/app
WORKDIR $BASE_DIR

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH $BASE_DIR/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
RUN npm i && npm cache clean --force

# Copies everything over to Docker environment
COPY . .

# Finally runs the application
CMD npm start
