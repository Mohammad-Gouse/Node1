const verifyToken = require("../../../../helpers/verify-token");
const addConfig = require("./add-config");
const getConfig = require("./get-config");
const { configValidation } = require("./validation/add-config-val");

module.exports = async (router) => {
  router.post(
    "/users/add-configuration",
    verifyToken,
    configValidation,
    addConfig.handler
  );
  router.get("/users/get-configuration", getConfig.handler);
};
