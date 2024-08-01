FROM node:18 as build
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY src src
RUN npm install
RUN npm run build

FROM node:18-alpine

RUN apk update && apk add --no-cache tail cron

WORKDIR /cf2dns
COPY --from=build /app/lib /cf2dns/lib
COPY --from=build /app/package.json /cf2dns/package.json
COPY --from=build /app/package-lock.json /cf2dns/package-lock.json
RUN npm install --production
RUN npm install --global /cf2dns



CMD ["tail -f /var/log/dpkg.log"]
