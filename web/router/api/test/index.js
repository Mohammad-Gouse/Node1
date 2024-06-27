const devices = require("./testApi");

module.exports = async (router) => {
  router.get("/hello", devices.getUsers);
};
