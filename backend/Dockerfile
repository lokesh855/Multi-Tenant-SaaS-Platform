FROM node:18-alpine

RUN apk add --no-cache postgresql-client curl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x entrypoint.sh && \
    dos2unix entrypoint.sh || sed -i 's/\r$//' entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["./entrypoint.sh"]

