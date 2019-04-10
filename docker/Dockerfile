FROM keymetrics/pm2:latest-alpine

# Expose the listening port of your app
EXPOSE 8000

# Show current folder structure in logs
RUN ls -al -R

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]

LABEL maintainer="Mark Honeychurch <mark@honeychurch.org>"


# Install application dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production
RUN curl --silent --show-error --fail --location \
      --header "Accept: application/tar+gzip, application/x-gzip, application/octet-stream" -o - \
      "https://caddyserver.com/download/linux/amd64?plugins=http.expires,http.realip,http.cache,http.cors&license=personal" \
    | tar --no-same-owner -C /usr/bin/ -xz caddy \
    && chmod 0755 /usr/bin/caddy \
    && /usr/bin/caddy -version

# Bundle APP files
COPY ../dist src/
COPY package.json .
COPY ecosystem.config.js .
COPY Caddyfile /etc/Caddyfile

#WORKDIR /srv/app/
#RUN chown -R apache:apache /srv/app

CMD ["/usr/bin/caddy", "-agree", "-conf", "/etc/Caddyfile", "-log", "stdout", "-email", "admin@skeptics.nz"]

#USER root:apache
USER 0:48

EXPOSE 80
EXPOSE 443
