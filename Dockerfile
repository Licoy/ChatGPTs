FROM node:18-alpine AS base

FROM base AS build

WORKDIR /app

RUN npm install pnpm -g

COPY package.json pnpm-lock.yaml ./

COPY . .

RUN pnpm i
RUN npm run build

FROM base AS final

WORKDIR /app

RUN npm install pnpm -g
COPY package.json pnpm-lock.yaml ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./.next/standalone
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/.next/server ./.next/server
COPY --from=build /app/dist ./dist

RUN pnpm i --production

EXPOSE 3000

CMD if [ -n "$PROXY_URL" ]; then \
        export HOSTNAME="127.0.0.1"; \
        export NODE_ENV="production"; \
        protocol=$(echo $PROXY_URL | cut -d: -f1); \
        host=$(echo $PROXY_URL | cut -d/ -f3 | cut -d: -f1); \
        port=$(echo $PROXY_URL | cut -d: -f3); \
        conf=/etc/proxychains.conf; \
        echo "strict_chain" > $conf; \
        echo "proxy_dns" >> $conf; \
        echo "remote_dns_subnet 224" >> $conf; \
        echo "tcp_read_time_out 15000" >> $conf; \
        echo "tcp_connect_time_out 8000" >> $conf; \
        echo "localnet 127.0.0.0/255.0.0.0" >> $conf; \
        echo "localnet ::1/128" >> $conf; \
        echo "[ProxyList]" >> $conf; \
        echo "$protocol $host $port" >> $conf; \
        cat /etc/proxychains.conf; \
        proxychains -f $conf node dist/index.js; \
    else \
        node dist/index.js; \
    fi
