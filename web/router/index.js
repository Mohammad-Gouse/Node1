const { router } = rootRequire("config");

require("./api/auth")(router);

require("./api/master/currency-master")(router);
require("./api/master/clarity")(router);
require("./api/master/colour")(router);
require("./api/master/currency-rate")(router);
require("./api/master/product")(router);
require("./api/master/shape")(router);
require("./api/master/size")(router);
require("./api/master/underlying-asset")(router);
require("./api/master/product_master")(router);
require("./api/configuration")(router);
require("./api/master/multi-filter-product-master")(router);
require("./api/master/user_price")(router);
require("./api/master/admin_price")(router);
require("./api/master/users-price")(router);

// Health route
router.get("/health", (ctx) => {
  ctx.status = 200;
  ctx.body = { status: "Okay", message: "Server is running healthy." };
});

/**
 * Mounting respective paths.
 * @param {object} app Koa instance
 */
module.exports = (app) => {
  // Mount the router under a specific path based on SERVICE_NAME
  console.log("app", app);
  return app.use(`/api/users`, router);
};
