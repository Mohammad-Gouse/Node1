const stringConstants = require('./strings');
const constantsVariables = require('./variables');
const errorCodeMapping = require('./errorCodeMapping');

module.exports = {
  ...stringConstants,
  ...errorCodeMapping,
  ...constantsVariables,
}
