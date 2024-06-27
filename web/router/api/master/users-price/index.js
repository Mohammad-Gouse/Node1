const verifyToken = require("../../../../../helpers/verify-token");
const getPrices = require("./getPrices");

module.exports = async (router) => {
  router.post("/users/price/:num", verifyToken, getPrices.handler);
};
