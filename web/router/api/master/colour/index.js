const verifyToken = require('../../../../../helpers/verify-token');
const { colourJoiValidation } = require('./validation/add-colour-val');
const addColour = require('./add-colours');
const getAllColour = require('./get-all-colours')
const deleteColor = require('./delete-colour')
const { colourValidation } = require('./validation/delete_colour')

module.exports = async (router) => {
  router.post('/master/colour', verifyToken, colourJoiValidation, addColour.handler);
  router.post('/master/colour/:num', verifyToken, getAllColour.handler);
  router.delete('/master/colour/:id', verifyToken, colourValidation, deleteColor.handler);
}