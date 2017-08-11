FROM node:8
RUN apt-install python make g++
WORKDIR /integration
COPY ../package.json ../setup-node-env.sh ./
RUN touch config.js && \
    mkdir server lib && \
    npm set progress=false && \
    npm config set depth 0 && \
    npm install --quiet
COPY ../lib ./lib/
RUN npm test

