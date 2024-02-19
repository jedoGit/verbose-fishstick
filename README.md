# verbose-fishstick

This project is a simple REST-API client and server. The front-end is a borrowed project `(author is Maximillian)` and is written in `ReactJs`. The back-end is a `NodeJs` project using the `ExpressJs` framework.

## Setup the REST-API-Server

> [!IMPORTANT]
>
> - Create a new file and name it `appConfig.json` and save it to the same level as `app.js` in the `REST-API-Server` directory
> - `appConfig` is required in most of the `js` files that need to access the `configuration` values listed below.
> - In the `appConfig.json` file, specify the following:
>
> ```
> {
>    "dbUri"          : "YOUR MONGO DB URI",
>    "mailerUser"     : "YOUR MAILER USER",
>    "mailerPass"     : "YOUR MAILER PASSWORD",
>    "mailerHost"     : "YOUR MAILER HOST",
>    "mailerPort"     : "YOUR MAILER PORT",
>    "jwtSecret"      : "YOUR JWT SECRET",
>    "jwtTokenExpire" : "YOUR JWT TOKEN EXPIRE",
>    "logLevel"       : "DEBUG"
> }
> ```

## Start the REST-API-Server from a terminal

1. Open a terminal and navigate to the `REST-API-Server` directory.

- Type `npm install`
- Type `npm start`

> [!NOTE]
>
> Verify that port `8081` is open. If not, either kill the process running in port `8081` or change the port in the `app.js` file.
> The server will be accessible in `http://localhost:8081`.
>
> ```
> //-----------------
> // Start the server
> //-----------------
> // Connect DB
> mongoose
>   .connect(appConfig.dbUri)
>   .then((result) => {
>     app.listen(8081);
>   })
>   .catch((err) => {
>     console.log(err);
>   });
> ```

## Start the REST-API-Client from a terminal

1. Open a terminal and navigate to the `REST-API-Client` directory.

- Type `npm install`
- Type `npm start`

> [!NOTE]
>
> ReactJs will make the front-end available in `http://localhost:3000`.

## Start the REST-API-Server using docker

1. Open a terminal and navigate to the `REST-API-Server` directory.

- Type `docker build -t rest-api-server .`
- Type `docker run --name rest-api-server -p 8081:8081 -d rest-api-server`

> [!NOTE]
>
> You will need to have a local instance of MongoDb installed and setup. Refer
> to MongoDb resources to setup local instance
>
> You can access the back-end service through: `http://localhost:8081`
>
> ```
> // TBD
> ```

## Start the REST-API-Client using docker

1. Open a terminal and navigate to the `REST-API-Client` directory.

- Type `docker build -t rest-api-client .`
- Type `docker run --name rest-api-client -p 3000:3000 -d rest-api-client`

> [!NOTE]
>
> You can access the front-end service through: `http://localhost:3000`
>
> ```
> // TBD
> ```

## Start the REST-Service-Blog using docker-compose

1. Open a terminal and navigate to the `REST-Service-Blog` directory.

- Type `docker compose up`

> [!NOTE]
>
> This will bring up all of the docker containers required:
>
> - Front-end service
> - Back-end service
> - MongoDb container
>
> You can access the front-end service through: `http://localhost:3000`
>
> You can access the back-end service through: `http://localhost:8081`
>
> ```
> // TBD
> ```
