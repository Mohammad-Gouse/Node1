const verifyToken = require('../../../../../helpers/verify-token');

const { shapeJoiValidation } = require('./validation/shapeVal');
const { deleteShapeValidation } = require('./validation/delete-shape')
const getAllShape = require('./getAllShape');
const deleteShape = require('./deleteShape');
const addShape = require('./addShape');


module.exports = async (router) => {
  router.post('/master/shape', verifyToken, shapeJoiValidation, addShape.handler);
  router.post('/master/shape/:num', verifyToken, getAllShape.handler);
  router.delete('/master/shape/:id', verifyToken, deleteShapeValidation, deleteShape.handler);

}