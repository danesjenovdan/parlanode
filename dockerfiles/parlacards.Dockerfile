# ---
# build stage image
# ---
FROM node:16-alpine as build

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
# actual image
# ---
FROM node:16-alpine

# set current directory
WORKDIR /app

# install production dependencies only
COPY parlacards/package.json parlacards/yarn.lock ./
ENV NODE_ENV=production
RUN yarn && yarn cache clean

# copy all needed files from build stage image
COPY --from=build /app/build ./build
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server

EXPOSE 3000

CMD ["yarn", "start"]