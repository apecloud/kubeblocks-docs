FROM node:20.10.0-alpine

WORKDIR /app

COPY ./.next/standalone ./
COPY ./.next/static ./.next/static
COPY ./public ./

ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
CMD ["nohup", "node", "server.js >> app.log 2>&1 &"]

