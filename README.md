# verbose-fishstick

This project is a simple REST-API client and server. The front-end is a borrowed project `(author is Maximillian)` and is written in `ReactJs`. The back-end is a `NodeJs` project using the `ExpressJs` framework.

## Setup the REST-API Server

> [!IMPORTANT]
>
> - Create a new file and name it `appConfig.json` and save it to the same level as `app.js` in the `REST-API-Server` directory
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
>    "jwtTokenExpire" : "YOUR JWT TOKEN EXPIRE"
> }
> ```
