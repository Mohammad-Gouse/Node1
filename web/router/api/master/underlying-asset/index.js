const verifyToken = require('../../../../../helpers/verify-token');

const { assetJoiValidation } = require('./validation/add-asset-val');
const { deleteAssetValidation } = require('./validation/delete-asset-val');
const addAsset = require('./add-asset');
const deleteAsset = require('./delete-asset');
const getAllAsset = require('./get-all-asset');

module.exports = async (router) => {

  router.post('/master/asset',verifyToken, assetJoiValidation, addAsset.handler);
  router.get('/master/asset/:num',verifyToken, getAllAsset.handler);
  router.delete('/master/asset/:id',verifyToken, deleteAssetValidation, deleteAsset.handler);
  
}