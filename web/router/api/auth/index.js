const login = require("./login.js");
const logout = require("./logout.js");
const register = require("./register");
const {loginJoiValidation} = require('./validation/login-val');
const {
  authenticateToken,
} = require("../../../../globalFunction/jwtAuthentication");
const { userJoiValidation } = require("./validation/user.joi");

module.exports = async (router) => {
  
  router.post("/users/login",loginJoiValidation, login.handler);
  router.post("/users/register", userJoiValidation, register.handler);
  router.post("/users/logout", authenticateToken, logout.handler);
};