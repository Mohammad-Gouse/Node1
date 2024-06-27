const addProductMasterService = require("./addProductMaster");
const getProductMasterDetails = require("./getProductMaster");
const verifyToken = require('../../../../../helpers/verify-token');
const { productMasterValidation } = require("./validation/productMasterValidation");

module.exports = async (router) => {
  router.post("/users/add-product-master",verifyToken, productMasterValidation, addProductMasterService.handler);
  router.get("/users/get-product-master/:num",verifyToken,getProductMasterDetails.handler);
};