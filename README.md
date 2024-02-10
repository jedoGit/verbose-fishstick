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

## Start the REST-API-Server

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

## Start the REST-API-Client

1. Open a terminal and navigate to the `REST-API-Client` directory.

- Type `npm install`
- Type `npm start`

> [!NOTE]
>
> ReactJs will make the front-end available in `http://localhost:3000`.
