FROM node:18 AS build
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY src src
RUN npm install
RUN npm run build

FROM node:18-slim

RUN set -x \
    && apt-get update \
    && apt-get install --no-install-recommends --no-install-suggests -y \
    cron \
    && apt-get remove --purge --auto-remove -y && rm -rf /var/lib/apt/lists/*

WORKDIR /cf2dns
COPY --from=build /app/lib /cf2dns/lib
COPY --from=build /app/package.json /cf2dns/package.json
COPY --from=build /app/package-lock.json /cf2dns/package-lock.json
COPY update-task /etc/cron.d/update-task

RUN npm install --omit=dev \
  && chmod 0644 /etc/cron.d/update-task \
  && crontab /etc/cron.d/update-task \
  && touch /var/log/cron.log

CMD cron && tail -f /var/log/cron.log
