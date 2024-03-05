# ---
# build stage image
# ---
FROM node:20-alpine as build-parlacards

# set current directory
WORKDIR /app

# install dependencies
COPY parlacards/package.json parlacards/yarn.lock ./
RUN yarn

# copy all files and run build
# NOTE: image needs to be build in root not in parlacards folder to have access to parlassets folder
#       so specify paths relative to the root
COPY parlassets /parlassets
COPY parlacards .
ARG VITE_PARLASSETS_URL
RUN yarn build

# ---
# build stage image
# ---
FROM node:20-alpine as build-parlassets

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

# copy nginx configuration
COPY parlassets/default.conf /etc/nginx/conf.d/default.conf

# copy built files from the 'build' container into the nginx container
COPY --from=build-parlassets /app/public /usr/share/nginx/html
COPY --from=build-parlacards /app/dist/client /usr/share/nginx/html/assets
