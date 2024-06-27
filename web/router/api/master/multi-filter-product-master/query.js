const {
  PRODUCT_MASTER_TBL,
  UNDERLYING_ASSET_TBL,
  SHAPE_TBL,
  SIZE_TBL,
  COLOUR_TBL,
  CLARITY_TBL,
  USERS,
  USER_PRICE,
  DCX_PRICE,
  CONFIGURATION_TBL,
} = require("../../../../../constants/strings");
const { sort } = require("../../../../../globalFunction/paginationSort");

exports.getProductCount = () =>
  `SELECT COUNT(*) FROM ${PRODUCT_MASTER_TBL} WHERE is_active=true`;

exports.getFilteredDataCount = (whereClause) => {
  const userPricesRanked = `up.product_id, up.price, up.user_id, up.updated_at,`;
  const dcxPricesRanked = `dp.product_id, dp.price, dp.updated_at,`;
  const rankedPrices = `product_id, price,price_model, updated_at,`;
  let fields = `sh.name AS shape,
	si.carat AS carat,
	co.name AS colour,
	cl.name AS clarity,
	(SELECT COUNT(*) FROM user_price WHERE pm.id = product_id GROUP BY product_id) AS total_count,
	jsonb_agg(jsonb_build_object('name', us.fullname, 'price', lup.price, 'date', lup.updated_at)) AS users,
	(SELECT price FROM ranked_prices WHERE product_id = pm.id AND row_num = 2) AS last_price,
	MAX(CASE WHEN rp.row_num = 1 THEN rp.price END) AS new_price,
	(SELECT price_model FROM ranked_prices WHERE product_id = pm.id AND row_num = 1) AS price_type,
	ROUND(
			(CAST(MAX(CASE WHEN rp.row_num = 1 THEN rp.price END) AS numeric) - 
			 CAST((SELECT price FROM ranked_prices WHERE product_id = pm.id AND row_num = 2) AS numeric)), 
			2
	) AS price_difference`;
  whereClause = whereClause ? `${whereClause} AND` : "";

  return `WITH user_prices_latest AS (
		SELECT ${userPricesRanked}
		ROW_NUMBER() OVER (PARTITION BY up.product_id, up.user_id ORDER BY up.updated_at DESC) AS rn
		FROM ${USER_PRICE} AS up
		WHERE up.is_active = true
		),
	dcx_prices_ranked AS (
			SELECT ${dcxPricesRanked}
					ROW_NUMBER() OVER (PARTITION BY dp.product_id ORDER BY dp.updated_at DESC) AS rn
			FROM 
					${DCX_PRICE} AS dp
	),
	ranked_prices AS (
			SELECT ${rankedPrices}
					ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY updated_at DESC) AS row_num
			FROM 
					${DCX_PRICE}
	),
	config AS (
			SELECT 
					CAST(days_count AS INT) AS days_count
			FROM 
					${CONFIGURATION_TBL}
			ORDER BY
					id 
			LIMIT 1
	)
	SELECT ${fields}
	FROM 
			${PRODUCT_MASTER_TBL} AS pm
	LEFT JOIN 
			${SHAPE_TBL} AS sh ON sh.id = pm.shape
	LEFT JOIN 
			${SIZE_TBL} AS si ON si.id = pm.size
	LEFT JOIN 
			${COLOUR_TBL} AS co ON co.id = pm.colour
	LEFT JOIN 
			${CLARITY_TBL} AS cl ON cl.id = pm.clarity
	LEFT JOIN 
			user_prices_latest AS lup ON lup.product_id = pm.id
	LEFT JOIN 
			${USERS} AS us ON us.id = lup.user_id 
	LEFT JOIN 
			dcx_prices_ranked AS ldp ON ldp.product_id = pm.id AND ldp.rn = 1
	LEFT JOIN 
			ranked_prices AS rp ON rp.product_id = pm.id AND rp.row_num = 1 
	LEFT JOIN 
			config ON true 
	WHERE 
			pm.is_active = true 
			AND (lup.updated_at IS NULL OR Date(lup.updated_at) >= CURRENT_DATE - (SELECT days_count FROM config)) -- Filtering based on price_valid_days
	GROUP BY 
			pm.id, sh.name, si.carat, co.name, cl.name
	ORDER BY
			CASE
					WHEN MAX(lup.price) IS NOT NULL AND MAX(us.fullname) IS NOT NULL THEN 0
					WHEN MAX(lup.price) IS NULL AND MAX(us.fullname) IS NULL THEN 1
					ELSE 2
			END,
			pm.updated_at DESC	
	`;
};

exports.getFilteredData = (whereClause, skip, limit) => {
  const userPricesRanked = `up.product_id, up.price, up.user_id, up.updated_at,`;
  const dcxPricesRanked = `dp.product_id, dp.price, dp.updated_at,`;
  const rankedPrices = `product_id, price,price_model, updated_at,`;
  let fields = `pm.id AS product_id,
	sh.name AS shape,
	si.carat AS carat,
	co.name AS colour,
	cl.name AS clarity,
	(SELECT COUNT(*) FROM user_price WHERE pm.id = product_id GROUP BY product_id) AS total_count,
	jsonb_agg(jsonb_build_object('userId', lup.user_id, 'name', us.fullname, 'price', lup.price,
	 'date', lup.updated_at)) AS users,
	(SELECT price FROM ranked_prices WHERE product_id = pm.id AND row_num = 2) AS last_price,
	MAX(CASE WHEN rp.row_num = 1 THEN rp.price END) AS new_price,
	(SELECT price_model FROM ranked_prices WHERE product_id = pm.id AND row_num = 1) AS price_type,
	ROUND(
			(CAST(MAX(CASE WHEN rp.row_num = 1 THEN rp.price END) AS numeric) - 
			 CAST((SELECT price FROM ranked_prices WHERE product_id = pm.id AND row_num = 2) AS numeric)), 
			2
	) AS price_difference`;
  whereClause = whereClause ? `${whereClause} AND` : "";

  return `WITH user_prices_latest AS (
		SELECT ${userPricesRanked}
		ROW_NUMBER() OVER (PARTITION BY up.product_id, up.user_id ORDER BY up.updated_at DESC) AS rn
		FROM ${USER_PRICE} AS up
		WHERE up.is_active = true
		),
	dcx_prices_ranked AS (
			SELECT ${dcxPricesRanked}
					ROW_NUMBER() OVER (PARTITION BY dp.product_id ORDER BY dp.updated_at DESC) AS rn
			FROM 
					${DCX_PRICE} AS dp
	),
	ranked_prices AS (
			SELECT ${rankedPrices}
					ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY updated_at DESC) AS row_num
			FROM 
					${DCX_PRICE}
	),
	config AS (
			SELECT 
					CAST(days_count AS INT) AS days_count
			FROM 
					${CONFIGURATION_TBL}
			ORDER BY
					id 
			LIMIT 1
	)
	SELECT ${fields}
	FROM 
			${PRODUCT_MASTER_TBL} AS pm
	LEFT JOIN 
			${SHAPE_TBL} AS sh ON sh.id = pm.shape
	LEFT JOIN 
			${SIZE_TBL} AS si ON si.id = pm.size
	LEFT JOIN 
			${COLOUR_TBL} AS co ON co.id = pm.colour
	LEFT JOIN 
			${CLARITY_TBL} AS cl ON cl.id = pm.clarity
	LEFT JOIN 
			user_prices_latest AS lup ON lup.product_id = pm.id
	LEFT JOIN 
			${USERS} AS us ON us.id = lup.user_id 
	LEFT JOIN 
			dcx_prices_ranked AS ldp ON ldp.product_id = pm.id AND ldp.rn = 1
	LEFT JOIN 
			ranked_prices AS rp ON rp.product_id = pm.id AND rp.row_num = 1 
	LEFT JOIN 
			config ON true 
	WHERE ${whereClause}
			pm.is_active = true 
			AND (lup.updated_at IS NULL OR Date(lup.updated_at) >= CURRENT_DATE - (SELECT days_count FROM config)) -- Filtering based on price_valid_days
	GROUP BY 
			pm.id, sh.name, si.carat, co.name, cl.name
	ORDER BY
			CASE                    
					WHEN MAX(lup.price) IS NOT NULL AND MAX(us.fullname) IS NOT NULL THEN 0
					WHEN MAX(lup.price) IS NULL AND MAX(us.fullname) IS NULL THEN 1
					ELSE 2
			END,
			pm.updated_at DESC	
	LIMIT ${limit} OFFSET ${skip};
	`;
};

exports.getDataToExcel = (whereClause) => {
  let fields = `ua.name as underlying_asset, sh.name as shape,
	cl.name as clarity,co.name as colour, si.carat as carat,
	pm.corelation_factor as corelation_factor, COALESCE(ldp.price, 0) AS price,
	COALESCE(TO_CHAR(ldp.updated_at, 'DD-MM-YYYY'), 'N/A') AS date`;
  whereClause = whereClause ? `${whereClause} AND` : "";

  let dcxFields = `dp.product_id, dp.price, dp.updated_at,`;

  return `WITH dcx_prices_ranked AS (
	SELECT ${dcxFields}
	ROW_NUMBER() OVER (PARTITION BY dp.product_id ORDER BY dp.updated_at DESC) AS rn
	FROM dcx_price AS dp
	)
	SELECT ${fields}
	FROM ${PRODUCT_MASTER_TBL} AS pm
	LEFT JOIN ${UNDERLYING_ASSET_TBL} AS ua ON ua.id = pm.underlying_id
	LEFT JOIN ${SHAPE_TBL} AS sh ON sh.id = pm.shape
	LEFT JOIN ${SIZE_TBL} AS si ON si.id = pm.size
	LEFT JOIN ${COLOUR_TBL} AS co ON co.id = pm.colour
	LEFT JOIN ${CLARITY_TBL} AS cl ON cl.id = pm.clarity
	LEFT JOIN dcx_prices_ranked AS ldp ON ldp.product_id = pm.id AND ldp.rn = 1
	WHERE ${whereClause} pm.is_active=true
	ORDER BY
	CASE
		WHEN ldp.price IS NOT NULL THEN 0
		WHEN ldp.price IS NULL THEN 1
		ELSE 2
	END,
	pm.colour desc;`;
};

exports.getBaseProductQuery = () => {
  let fields = `pm.id,si.carat as carat,cl.name as clarity,sh.name as shape,co.name as colour,pm.corelation_factor as corelation_factor,pm.price as system_derived_price,'' as price `;
  return `
  select ${fields}
    from ${PRODUCT_MASTER_TBL} as pm
    join ${SIZE_TBL} si on si.id=pm.size
    join ${CLARITY_TBL} cl on cl.id=pm.clarity
    join ${SHAPE_TBL} sh on sh.id=pm.shape
    join ${COLOUR_TBL} co on co.id=pm.colour
    where carat=1 and cl.name ilike 'if' and sh.name ilike 'round' and co.name ilike 'd'
    `;
};
