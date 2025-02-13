FROM node:18-alpine


WORKDIR /app


COPY package.json package-lock.json ./


RUN npm install


RUN npm install -g concurrently


COPY . .


EXPOSE 5173 3000


ENV NODE_ENV=production


CMD ["npm", "run", "dev"]
