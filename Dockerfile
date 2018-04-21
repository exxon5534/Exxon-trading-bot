FROM node:8

RUN mkdir -p /app
WORKDIR /app

COPY . /app
RUN npm install -g node-gyp
RUN npm install --unsafe

RUN ln -s /app/exxon.sh /usr/local/bin/exxon

ENV NODE_ENV production

ENTRYPOINT ["/usr/local/bin/node", "exxon.js"]
CMD [ "trade", "--paper" ]
