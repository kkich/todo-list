FROM node:22-alpine
COPY package*.json /opt/
COPY ./server /opt/server 
COPY ./ui /opt/ui 
WORKDIR /opt/
# COPY package*.json ./
RUN npm install

ENV PORT=3000
EXPOSE ${PORT}
# EXPOSE 3000

CMD ["node", "server/index.js"]



