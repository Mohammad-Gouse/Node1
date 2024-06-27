/*
 * This file contains all the neccesary scripts which has to be
 * executed as the application starts.
 */
// creates uploads folder if it does not exist
const fs = require('fs');
const { logger } = require('../config');

function createFolders(folderNames) {
  if (!folderNames || folderNames.length === 0) return 0;
  folderNames.forEach((folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
      return logger.info(`${folder} folder created`);
    }
    return true;
  }, this);
}

function init(folderNames) {
  createFolders(folderNames);
}

module.exports = { init };