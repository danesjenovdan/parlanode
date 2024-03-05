# ---
# actual image
# ---
FROM node:20-alpine

# install tini
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

# set current directory
WORKDIR /app

# install dependencies
COPY parlasite/package.json parlasite/yarn.lock ./
RUN yarn && yarn cache clean

# copy all files and run build
COPY parlasite .

# set user
USER node

# define port
EXPOSE 3066

CMD ["node", "--max-old-space-size=350", "--optimize-for-size", "server/index.js"]
