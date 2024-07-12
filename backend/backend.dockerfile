FROM node:alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run db:generate

RUN npm run db:migrate

EXPOSE 4000

ENV PORT 4000

RUN npm run build

CMD ["npm", "start"]