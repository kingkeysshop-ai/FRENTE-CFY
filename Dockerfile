FROM node:18-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9 --activate
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json pnpm-lock.yaml* .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build:server

FROM node:18-alpine AS runner

RUN apk add --no-cache tini

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data
COPY --from=builder /app/script ./script
COPY --from=builder /app/index.js ./
COPY --from=builder /app/medusa-config.js ./
COPY --from=builder /app/package.json ./

RUN mkdir -p /app/uploads

# TypeORM 0.3.x patches - rejects empty criteria in update({}, { is_installed: false })
# 4 services: payment-provider, notification, fulfillment-provider, tax-provider
RUN sed -i "s/\.update({}, { is_installed: false })/.query('UPDATE payment_provider SET is_installed = false')/" /app/node_modules/@medusajs/medusa/dist/services/payment-provider.js && \
    sed -i "s/\.update({}, { is_installed: false })/.query('UPDATE notification_provider SET is_installed = false')/" /app/node_modules/@medusajs/medusa/dist/services/notification.js && \
    sed -i "s/\.update({}, { is_installed: false })/.query('UPDATE fulfillment_provider SET is_installed = false')/" /app/node_modules/@medusajs/medusa/dist/services/fulfillment-provider.js && \
    sed -i "s/\.update({}, { is_installed: false })/.query('UPDATE tax_provider SET is_installed = false')/" /app/node_modules/@medusajs/medusa/dist/services/tax-provider.js

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

RUN chown -R node:node /app
USER node

EXPOSE 9000

ENTRYPOINT ["/sbin/tini", "--", "docker-entrypoint.sh"]
