const { COLOUR_TBL } = require("../../../../../constants/strings");
const { sort } = require("../../../../../globalFunction/paginationSort");

exports.getColourCountQuery = () => 
  `SELECT COUNT(*) FROM ${COLOUR_TBL} WHERE is_active=true`;

exports.getAllColourQuery = (name, skip, limit) => {
  let nameCondition = name !== undefined ? `name ILIKE '%${name}%' AND` : "";
  return `
    SELECT id, name
    FROM ${COLOUR_TBL}
    WHERE
      ${nameCondition}
      is_active = true
    ${sort(null, "name", "asc")}
    LIMIT ${limit} OFFSET ${skip}
  `;
};

exports.getSpecificColour = (colourId) =>
  `SELECT id FROM ${COLOUR_TBL} WHERE id='${colourId}'`;
