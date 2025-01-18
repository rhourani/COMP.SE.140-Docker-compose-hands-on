FROM node:latest


WORKDIR /app

COPY package*.json /app/
COPY . .
RUN npm install

#ENV PORT=8199

#EXPOSE 8199

CMD ["npm", "start"]

#ps aux | grep docker

#sudo kill -9 <pid>
