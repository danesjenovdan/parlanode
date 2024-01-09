# ---
# actual image
# ---
FROM node:20-alpine

# set current directory
WORKDIR /app

# install dependencies
COPY parlasite/package.json parlasite/yarn.lock ./
RUN yarn && yarn cache clean

# copy all files and run build
COPY parlasite .

EXPOSE 3066

CMD ["yarn", "start"]
