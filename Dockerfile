FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY dist/ /srv/
RUN caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile

EXPOSE 8080
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
