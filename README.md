# verbose-fishstick 

This project is a simple REST-API client and server. The front-end is a borrowed project `(author is Maximillian)` and is written in `ReactJs`. The back-end is a `NodeJs` project using the `ExpressJs` framework.

## Setup the REST-API-Server

> [!IMPORTANT]
>
> - Create a new file and name it `.env` and save it to the same level as `app.js` in the `./REST-API-Server` directory
> - `.env` is required in most of the `js` files that need to access the `configuration` values listed below.
> - In the `.env` file, specify the following:
>
> ```
> DB_URI="mongodb://mongo_db:27017/messages?retryWrites=true&w=majority"
> MAILER_USER="YOUR MAILER USER""
> MAILER_PASS="YOUR MAILER PASSWORD"
> MAILER_HOST="YOUR MAILER HOST"
> MAILER_PORT="YOUR MAILER PORT"
> JWT_SECRET="YOUR JWT SECRET"
> JWT_TOKEN_EXPIRE="30m"
> LOG_LEVEL="DEBUG"
> ```

## Start the REST-Service-Blog using docker compose

1. Open a terminal and navigate to the `./REST-Service-Blog` directory.

- Type `docker compose up`

> [!NOTE]
>
> You will need to have Docker installed in your system. Refer to Docker documentations on how to install and setup Docker on your machine.
>
> This will bring up all of the Docker containers required:
>
> - Front-end service container
> - Back-end service container
> - MongoDb container
>
> You can access the front-end service through: `http://localhost:3000`
>
> You can access the back-end service through: `http://localhost:8081`
>
> You can access the mongoDb service through: `http://localhost:27017`
>
> Connect your MongoDb compass to this URL:
>
> ```
> mongodb://localhost:27017/messages?retryWrites=true&w=majority
> ```

## Start the REST-API-Server using docker

1. Open a terminal and navigate to the `./REST-API-Server` directory.

- Type `docker build -t rest-api-server .`
- Type `docker run --name rest-api-server -p 8081:8081 -d rest-api-server`

> [!NOTE]
>
> You will need to have Docker installed in your system. Refer to Docker documentations on how to install and setup Docker on your machine.
>
> You will need to have a local instance of MongoDb installed and setup. Refer to MongoDb resources to setup local instance. Review the docker compose yaml file to understand how to setup the MongoDb docker instance.
>
> You can access the back-end service through: `http://localhost:8081`
>
> ```
> // TBD
> ```

## Start the REST-API-Client using docker

1. Open a terminal and navigate to the `./REST-API-Client` directory.

- Type `docker build -t rest-api-client .`
- Type `docker run --name rest-api-client -p 3000:3000 -d rest-api-client`

> [!NOTE]
>
> You will need to have Docker installed in your system. Refer to Docker documentations on how to install and setup Docker on your machine.
>
> You can access the front-end service through: `http://localhost:3000`
>
> ```
> // TBD
> ```
