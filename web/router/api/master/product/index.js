const addProduct = require('./addProduct');
const {fileVal} = require('./validation/file-validation');
const verifyToken = require('../../../../../helpers/verify-token');
const multer = require('koa-multer');
const upload = multer({ storage: multer.memoryStorage() });

module.exports = async(router) => {
  router.post('/master/product',verifyToken,upload.single('file'),fileVal,addProduct.handler);
}