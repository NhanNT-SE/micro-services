# Use an existing docker image as a base
FROM node:14.17.0-alpine
WORKDIR /app
# Download and install dependency
COPY ./package.json ./
RUN npm install
COPY ./ ./

# Tell the image what to do when it start as a container
CMD ["npm","start"]
