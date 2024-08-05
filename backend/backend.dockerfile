FROM node:20-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN ls -al

RUN npm run db:generate

RUN npm run db:migrate

RUN npm run db:seed

EXPOSE 4000

ENV PORT 4000

RUN npm run build

CMD ["npm", "start"]