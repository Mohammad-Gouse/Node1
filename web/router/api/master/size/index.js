const verifyToken = require('../../../../../helpers/verify-token');

const { sizeValidation } = require('./validation/add-size-val');
const addSize = require('./add-size');
const getAllSize = require('./get-all-size');
const { sizeDeleteValidation } = require('./validation/delete-size');
const deleteSize = require('./delete-size')

module.exports = async (router) => {
  router.post('/master/size', verifyToken , addSize.handler);
  router.post('/master/size/:num', verifyToken, getAllSize.handler);
  router.delete('/master/size/:id', verifyToken, sizeDeleteValidation, deleteSize.handler)

}