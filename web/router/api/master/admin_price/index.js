const calculationPriceService = require("./calculatePrice");
const addPrice = require("./addDcxPrice");
const savePrice = require("./saveDcxPrice");

module.exports = async (router) => {
  router.post("/calculate-price", calculationPriceService.handler);
  router.post("/update-base-product", addPrice.handler);
  router.post("/save-dcx-price", savePrice.handler);
};
