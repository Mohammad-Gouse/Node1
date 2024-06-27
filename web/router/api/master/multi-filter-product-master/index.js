const multiFilter = require("./multi-filter");
const downloadExcel = require("./download-excel");
const getBaseProduct = require("./getBaseProduct");

module.exports = async (router) => {
  router.post("/master/multi-filter/:num", multiFilter.handler);
  router.post("/master/multi-filter/download", downloadExcel.handler);
  router.post("/master/get-base-product", getBaseProduct.handler);
};
