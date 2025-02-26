FROM node:20.10.0-alpine

LABEL maintainer="sailwebs <sailwebs@apecloud.com>"
LABEL version="1.0"
LABEL description="kubeblocks docs application"

WORKDIR /usr/local/kubeblocks-docs

COPY ./ ./

EXPOSE 3000

CMD ["sh", "-c", "yarn start"]

