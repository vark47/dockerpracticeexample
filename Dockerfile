FROM node:6.10.0

#ARG NG_ENV
# WORKDIR /usr/ng
# RUN npm install -g @angular/cli@1.1.2 
# COPY ./package.json .
# RUN npm install
# RUN ng build --env=$NG_ENV

WORKDIR /usr/app
COPY ./server/package.json .

RUN npm install
RUN npm i -g pm2

EXPOSE 3000

CMD ["pm2", "start", "pm2-processes.json", "--no-daemon"]

#CMD ["node", "./bin/www"]