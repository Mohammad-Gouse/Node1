const { clarityValidation } = require('./validation/add-clarity-val');
const { deleteClarityValidation } = require('./validation/delete-clarity-val');
const addClarity = require('./add-clarity');
const deleteClarity = require('./delete-clarity');
const getAllClarity = require('./get-all-clarity');
const verifyToken = require('../../../../../helpers/verify-token');

module.exports = async (router) => {
  router.post('/master/clarity',verifyToken, clarityValidation, addClarity.handler);
    router.post('/master/clarity/:num',verifyToken, getAllClarity.handler);
    router.delete('/master/clarity/:id',verifyToken, deleteClarityValidation, deleteClarity.handler);
}