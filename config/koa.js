/**
 * Setting basic configurations for Express and only expose app (express) object
 * for further processing.
 */
const Koa = require('koa');
const app = new Koa();

module.exports = () => {
  return app;
};