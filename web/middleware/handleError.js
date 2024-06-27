const Boom = require('@hapi/boom');

const { logger } = rootRequire('config');
const { getJoiErrors } = rootRequire('utils');
const { pg } = rootRequire('db');

module.exports = function(app) {

  app.use((ctx, next) => {
    console.log(ctx.path)
    logger.info(`method: ${ctx.request.method} | path: ${ctx.request.url} | status: ${ctx.response.status} | message: ${ctx.response.message}`);
    return next();
  });

  app.on('error', (err, ctx) => {
    logger.error('server error', err, ctx)
    // Convert if error does not belong to Boom object
    const _err = err.isBoom ? err : Boom.boomify(err, { statusCode: 500 });
    _err.message = err.isJoi ? getJoiErrors(err) : _err.message;
    // Handle database error
    if (!pg.exposeDBError(err)) {
      _err.message = 'Invalid input';
      logger.error(`Database Error | message: ${err.message} | status: 500`);
    }
    /** Boom error */
    const payload = {
      error: _err.output.payload.error,
      message: _err.message,
      statusCode: _err.output.payload.statusCode,
    };
    if (process.env.DEV_ENV === 'development') logger.error(`Stack: ${_err.stack}`);
    logger.error(`Name: ${payload.error} | message: ${payload.message} | status: ${payload.statusCode}`);
    ctx.status = payload.statusCode || 500 .json(payload);
  });
};