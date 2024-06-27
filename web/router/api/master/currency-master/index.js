const addCurrency = require('./add-currency');
const deleteCurrency = require('./delete-currency');
const getAllCurrency = require('./get-all-currency');
const verifyToken = require('../../../../../helpers/verify-token');
const { currencyJoiValidation } = require('./validation/add-currency-val');
const { deleteCurrencyValidation } = require('./validation/delete-currency-val')

module.exports = async (router) => {
  router.post('/master/curriencs', verifyToken, currencyJoiValidation, addCurrency.handler);
  router.get('/master/currency/:num',verifyToken, getAllCurrency.handler);
  router.delete('/master/currency/:id',verifyToken, deleteCurrencyValidation, deleteCurrency.handler);
}