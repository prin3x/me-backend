FROM node:16

WORKDIR /me-backend/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start" ]