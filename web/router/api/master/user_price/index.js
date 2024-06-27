const addUserPriceService = require("./addUserPrice");
// const getProductMasterDetails = require("./getProductMaster");
const verifyToken = require('../../../../../helpers/verify-token');

const {
  authenticateToken,
} = require("../../../../../globalFunction/jwtAuthentication");
const { userPriceValidation } = require("./validation/userPriceValidation");

module.exports = async (router) => {
  router.post("/master/add-user-price", verifyToken,userPriceValidation, addUserPriceService.handler);
  router.post("/master/calculate-dirty-price", userPriceValidation, addUserPriceService.handler);
};