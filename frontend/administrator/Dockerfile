FROM node:20-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY ./frontend/administrator .

EXPOSE 5000
CMD ["node", "index.js"]


