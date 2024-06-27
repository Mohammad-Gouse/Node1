#FROM node:21-alpine3.18
#FROM 211125344835.dkr.ecr.ap-south-1.amazonaws.com/temp-dev-9to5-users-ms:latest
FROM thennetivamsikumar/common:latest1
WORKDIR /usr/web/app
COPY package*.json ./
RUN npm install
RUN npm install dotenv
# Bundle app source
COPY . .
RUN ls -al
EXPOSE 4500
CMD [ "node", "index.js","run" ]
