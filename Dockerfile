FROM keymetrics/pm2:latest-slim

LABEL maintainer="Mark Honeychurch <mark@honeychurch.org>"

WORKDIR /app

# Bundle APP files
COPY package.json .
COPY ecosystem.config.js .
COPY nuxt.config.js .
#COPY Caddyfile /etc/Caddyfile
COPY Caddyfile .
#COPY dist ./dist
COPY src/client ./src/client
COPY src/server ./src/server

# Install application dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN curl https://getcaddy.com | bash -s personal http.cache,http.cors
RUN yarn install --production
RUN ./node_modules/.bin/nuxt build --modern

# Expose the listening ports of your app
EXPOSE 80 443 3000 4000 43554

#CMD tail -f /dev/null
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
