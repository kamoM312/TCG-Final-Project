FROM node:20-alpine
WORKDIR /usr/src/app

# Copy only root-level package files
COPY package*.json ./

RUN npm install --omit=dev

# Copy only the frontend source folder (not the entire repo)
COPY ./frontend/user .

EXPOSE 4000
CMD ["node", "index.js"]


