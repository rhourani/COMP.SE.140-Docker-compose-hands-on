FROM node:latest


WORKDIR /app

COPY package*.json /.
COPY . .
RUN npm install

#ENV PORT=8199

#EXPOSE 8199

CMD ["npm", "start"]