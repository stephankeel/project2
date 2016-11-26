# To build and run with Docker:
#
#  $ docker build -t ng-homeautomation .
#  $ docker run -it --rm -p 3000:3000 -p 3001:3001 ng-homeautomation
#
FROM node:latest

RUN mkdir -p /homeautomation /home/nodejs && \
    groupadd -r nodejs && \
    useradd -r -g nodejs -d /home/nodejs -s /sbin/nologin nodejs && \
    chown -R nodejs:nodejs /home/nodejs

WORKDIR /homeautomation
COPY package.json /homeautomation/
RUN npm install --unsafe-perm=true

COPY . /homeautomation
RUN chown -R nodejs:nodejs /homeautomation
USER nodejs

CMD npm start
