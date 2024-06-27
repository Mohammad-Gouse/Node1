class AppResponse {
  constructor(app) {
    this.app = app;
  }

  appSuccessResponse() {
    this.app.context.success = function (
      ctx,
      message,
      data,
      displayMessage,
      code
    ) {
      if (ctx) {
        ctx.status = code || 200;
        ctx.body = Response(
          "success",
          true,
          message,
          data,
          displayMessage,
          code
        );
      }
    };
  }

  appErrorResponse() {
    this.app.context.error = function (
      ctx,
      message,
      data,
      displayMessage,
      code
    ) {
      const newMessage =
        typeof message !== "string" ? "Something went wrong" : message;
      if (ctx) {
        ctx.status = code || 500;
        ctx.body = Response(
          "error",
          false,
          newMessage,
          data,
          displayMessage,
          code
        );
      }
    };
  }

  appUnauthorizedResponse() {
    this.app.context.unauthorized = function (ctx, message) {
      const newMessage =
        typeof message !== "string" ? "Something went wrong" : message;
      if (ctx) {
        ctx.status(403).send(
          Response("Unauthorized User", newMessage, null, null, 403)
        );
      }
    };
  }

  appAccessDeniedResponse() {
    this.app.context.accessDenied = function () {
      this.status(200).send(
        Response("error", "Access Denied", null, null, 500)
      );
    };
  }
}

/**
 *
 * @param {String} type
 * @param {String} message
 * @param {Object} data
 * @param {Object} displayMessage
 * @param {Number} code
 * @returns {Object} Response Object {code: number, message: string, data: any, displayMessage: any}
 */
const Response = (type, status, message, data, displayMessage, code) => {
  let defaultCode = type == "success" ? 200 : 500;
  return {
    status,
    code: code || defaultCode,
    message,
    response: data,
    displayMessage,
  };
};

module.exports = AppResponse;
