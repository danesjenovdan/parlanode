# ---
# build stage image
# ---
FROM node:16-alpine as build

# set current directory
WORKDIR /app

# install dependencies
COPY parlassets/package.json parlassets/yarn.lock ./
RUN yarn

# copy all files and run build
COPY parlassets .
ENV NODE_ENV=production
RUN yarn sass

# ---
# actual image
# ---
FROM nginx:alpine

# copy built files from the 'build' container into the nginx container
COPY --from=build /app/css /usr/share/nginx/html/css
COPY --from=build /app/fonts /usr/share/nginx/html/fonts
COPY --from=build /app/icons /usr/share/nginx/html/icons
COPY --from=build /app/img /usr/share/nginx/html/img
COPY --from=build /app/js /usr/share/nginx/html/js
COPY --from=build /app/scss/style.css /usr/share/nginx/html/scss/style.css
