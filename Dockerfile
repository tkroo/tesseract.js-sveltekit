# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

# ARG BASE_IMAGE=node:20-bookworm-slim
# ARG BASE_IMAGE=node:slim
ARG BASE_IMAGE=node:20.12-slim

################################################################################
# Use node image for base image for all stages.
FROM ${BASE_IMAGE} as build
# RUN npm install -g npm@10.5.2

WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

FROM ${BASE_IMAGE} as prod
# RUN apk add --no-cache python3 py3-pip pkg-config make g++
# RUN npm install -g npm@10.5.2
WORKDIR /app
COPY --from=build /app/build ./build/
COPY --from=build /app/package*.json ./
RUN npm i --omit=dev
EXPOSE 3000
ENV BODY_SIZE_LIMIT=3e6
ENV NODE_ENV=production
CMD [ "node", "build/index.js" ]