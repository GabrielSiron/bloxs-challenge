FROM node:20.10.0

RUN mkdir app/

WORKDIR app/

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]