FROM node:14
WORKDIR /var/www
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD [ "node", "server.js" ]