FROM node:17-alpine
WORKDIR /var/cache/nodejs
COPY package.json .
RUN ["npm", "install"]
COPY . .
RUN ["npm", "run", "build"]