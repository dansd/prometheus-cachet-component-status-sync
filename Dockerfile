FROM node:12 as builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src
RUN npm ci --quiet && npm run tsc

FROM node:12-slim as prod

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --quiet --only=production

COPY --from=builder /usr/src/app/dist ./dist

CMD npm start