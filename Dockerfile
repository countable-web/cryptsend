FROM node:9-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache git

