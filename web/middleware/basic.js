const cors = require("koa2-cors");
const helmet = require("koa-helmet");
const { default: koaBody } = require("koa-body");
const AppResponse = require("../../helpers/response");

function basicMiddlewares(app) {
  app.use(cors());
  app.use(helmet());
  app.use(helmet.xssFilter({ setOnOldIE: true }));
  app.use(koaBody({ multipart: true, formidable: true }));
  appResponse(app);
}

const appResponse = (app) => {
  const Response = new AppResponse(app);
  Response.appErrorResponse();
  Response.appSuccessResponse();
  Response.appAccessDeniedResponse();
  Response.appUnauthorizedResponse();
};

module.exports = basicMiddlewares;
