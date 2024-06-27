// list of all the properties binded to Global Scope
const path = require('path');
// const { promisify } = require('util');

global.rootRequire = function (name) {
  const module = require(path.join(__dirname, name)); // eslint-disable-line
  return module;
};

global._ = require('lodash');

// global.sleep = promisify(setTimeout);
global.PROJECT_ROOT_DIRECTORY = path.resolve(__dirname);