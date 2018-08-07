FROM node:10-alpine as build

# install gyp tools
RUN apk add --update --no-cache \
        python \
        make \
        g++

ADD . /src
WORKDIR /src
RUN npm ci
RUN npm run lint
RUN npm run test
RUN npm prune --production

FROM node:10-alpine

ENV PORT=3010
EXPOSE 3010

COPY --from=build /src/package.json package.json
COPY --from=build /src/package-lock.json package-lock.json
COPY --from=build /src/node_modules node_modules
COPY --from=build /src/bin bin
COPY --from=build /src/handlers handlers
COPY --from=build /src/lib lib
COPY --from=build /src/config.mjs config.mjs

RUN npm link

HEALTHCHECK CMD healthcheck

CMD node --experimental-modules ./bin/start.mjs