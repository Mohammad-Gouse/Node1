const verifyToken = require('../../../../../helpers/verify-token');
const { rateJoiValidation } = require('./validation/add-rate-val');
const { deleteRateValidation } = require('./validation/delete-rate-val')
const getAllRate = require('./get-all-rate');
const deleteRate = require('./delete-rate');
const addRate = require('./add-rate')
const updateRatePrice = require('./update-rate');
const { updateRatePriceValidation } = require('./validation/update-price-val');

module.exports = async (router) => {
  router.post('/master/rate', verifyToken, rateJoiValidation, addRate.handler);
  router.get('/master/rate/:num', verifyToken, getAllRate.handler);
  router.delete('/master/rate/:id', verifyToken, deleteRateValidation, deleteRate.handler);
  router.patch('/master/rate/:id', verifyToken, updateRatePriceValidation, updateRatePrice.handler);
}