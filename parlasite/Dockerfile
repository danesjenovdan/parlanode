# ---
# build image
# ---
FROM node:16-alpine as build

# set current directory
WORKDIR /app

# install dependencies
COPY package.json yarn.lock ./
RUN yarn

# copy app
COPY . .

EXPOSE 3066

CMD ["node", "run.js"]
