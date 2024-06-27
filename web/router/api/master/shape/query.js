const { SHAPE_TBL } = require("../../../../../constants/strings");
const { sort } = require("../../../../../globalFunction/paginationSort");

exports.getShapeCountQuery = () =>
    `SELECT COUNT(*) FROM ${SHAPE_TBL} WHERE is_active=true`;

exports.getAllShapesQuery = (name, skip, limit) => {
    let nameCondition = name !== undefined ? `name ILIKE '%${name}%' AND` : "";
    return `
      SELECT id, name
      FROM ${SHAPE_TBL}
      WHERE
        ${nameCondition}
        is_active = true
      ${sort(null, "updated_at", "desc")}
      LIMIT ${limit} OFFSET ${skip}
    `;
  };

exports.shapeExistQuery = (shapeId) => 
  `SELECT * FROM ${SHAPE_TBL} WHERE id='${shapeId}' AND is_active=true`;
  
  
exports.deleteShapeQuery = (shapeId) => 
  `UPDATE ${SHAPE_TBL} SET is_active = false WHERE id='${shapeId}' AND is_active=true`