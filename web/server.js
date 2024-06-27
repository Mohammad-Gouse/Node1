const { koa, router } = rootRequire("config");
const app = koa();

const { logger } = require("../config");
const { AbortController } = require("abort-controller");
const controller = new AbortController();

const http = require("http");

// mounting middlewares
const { basic, handleError } = require("./middleware");

basic(app);

require("./router");

app.use(router.routes()).use(router.allowedMethods());

handleError(app);

const httpServer = http.createServer(app.callback());

let PORT;

if (process.env.ENV === 'prod') {
  PORT = process.env.PROD_PORT;
} else if (process.env.ENV === 'dev') {
  PORT = process.env.DEV_PORT;
}

httpServer.listen(
  {
    host: process.env.HOST,
    port: PORT,
    signal: controller.signal,
  },
  (err) => {
    if (err) {
      logger.error(
        `Error while starting server at port ${PORT} | Error: ${err.message}`
      );
    }
    console.log(`Environment: ${process.env.DEV_ENV}`);
    console.log(
      `http Koa Server Up and Running @PORT: ${PORT} | at localhost`
    );
    logger.info(`Environment: ${process.env.DEV_ENV}`);
    logger.info(
      `Koa Server Up and Running @PORT: ${PORT} | at localhost`
    );
  }
);

module.exports = {
  app,
  controller,
  router,
};
