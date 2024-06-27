const {
  PRODUCT_MASTER_TBL,
  USER_PRICE,
  SHAPE_TBL,
  CLARITY_TBL,
  SIZE_TBL,
  COLOUR_TBL,
  CONFIGURATION_TBL,
} = require("../../../../../constants/strings");

exports.getUserPriceCount = (userId, whereClause) => {
  whereClause = whereClause ? `${whereClause} AND` : "";
  return `SELECT COUNT(*)
  from ${USER_PRICE} AS up 
  LEFT JOIN ${PRODUCT_MASTER_TBL} AS pm ON up.product_id = pm.id
  LEFT JOIN ${SHAPE_TBL} AS sh ON sh.id = pm.shape
  LEFT JOIN ${CLARITY_TBL} AS cl ON cl.id = pm.clarity
  LEFT JOIN ${SIZE_TBL} AS si ON si.id = pm.size
  LEFT JOIN ${COLOUR_TBL} AS co ON co.id = pm.colour
  WHERE ${whereClause} user_id = '${userId}' AND
      pm.is_active = true 
      AND (up.created_at IS NULL OR Date(up.created_at) >= CURRENT_DATE - (SELECT 
          CAST(days_count AS INT) AS days_count
      FROM ${CONFIGURATION_TBL}
      ORDER BY id 
      LIMIT 1))
  ;`;
};

exports.getUserPrice = (userId, skip, limit, whereClause) => {
  const fields = `  pm.id as product_id,    sh.name AS shape, 
  cl.name AS clarity, 
  si.carat AS carat, 
  co.name AS colour, 
  up.price,
  up.created_at AS date,
  ROW_NUMBER() OVER (PARTITION BY up.product_id ORDER BY up.created_at DESC) AS rn
`;
  whereClause = whereClause ? `${whereClause} AND` : "";

  // return `SELECT ${fields}
  // from ${USER_PRICE} AS up
  // LEFT JOIN ${PRODUCT_MASTER_TBL} AS pm ON up.product_id = pm.id
  // LEFT JOIN ${SHAPE_TBL} AS sh ON sh.id = pm.shape
  // LEFT JOIN ${CLARITY_TBL} AS cl ON cl.id = pm.clarity
  // LEFT JOIN ${SIZE_TBL} AS si ON si.id = pm.size
  // LEFT JOIN ${COLOUR_TBL} AS co ON co.id = pm.colour
  // WHERE ${whereClause} user_id = '${userId}' AND
  //     pm.is_active = true
  //     AND (up.created_at IS NULL OR Date(up.created_at) >= CURRENT_DATE - (SELECT
  //         CAST(days_count AS INT) AS days_count
  //     FROM ${CONFIGURATION_TBL}
  //     ORDER BY id
  //     LIMIT 1))
  //     ORDER BY up.updated_at DESC
  //     LIMIT ${limit} OFFSET ${skip};
  // ;`;

  return `
  WITH ranked_prices AS (
    SELECT 
      ${fields}
      from ${USER_PRICE} AS up 
      LEFT JOIN ${PRODUCT_MASTER_TBL} AS pm ON up.product_id = pm.id
      LEFT JOIN ${SHAPE_TBL} AS sh ON sh.id = pm.shape
      LEFT JOIN ${CLARITY_TBL} AS cl ON cl.id = pm.clarity
      LEFT JOIN ${SIZE_TBL} AS si ON si.id = pm.size
      LEFT JOIN ${COLOUR_TBL} AS co ON co.id = pm.colour
      WHERE ${whereClause} user_id = '${userId}' AND
      pm.is_active = true 
      AND (up.created_at IS NULL OR Date(up.created_at) >= CURRENT_DATE - (SELECT 
          CAST(days_count AS INT) AS days_count
      FROM ${CONFIGURATION_TBL}
      ORDER BY id 
      LIMIT 1))
      ORDER BY up.updated_at DESC
       )
  SELECT 
  product_id,
    shape, 
    clarity, 
    carat, 
    colour, 
    price, 
    date
  FROM ranked_prices
  WHERE rn = 1
  ORDER BY date DESC
  LIMIT ${limit} OFFSET ${skip};  `;
};
