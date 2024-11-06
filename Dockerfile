# /app /usr
FROM node:18.20-alpine
#cd app
WORKDIR /app

COPY app config .env .env_local .sequelizerc app.js package.json ./

RUN npm install 

CMD [ "npm run dev"]