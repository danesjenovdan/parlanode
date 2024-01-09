# ---
# build stage image
# ---
FROM node:20-alpine as build

# set current directory
WORKDIR /app

# install dependencies
COPY parlassets/package.json parlassets/yarn.lock ./
RUN yarn

# copy all files and run build
COPY parlassets .
ENV NODE_ENV=production
RUN yarn build

# ---
# actual image
# ---
FROM nginx:alpine

# copy built files from the 'build' container into the nginx container
COPY --from=build /app/public /usr/share/nginx/html
