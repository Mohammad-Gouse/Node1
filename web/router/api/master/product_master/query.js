const { PRODUCT_MASTER_TBL,SHAPE_TBL,SIZE_TBL,COLOUR_TBL,CLARITY_TBL,UNDERLYING_ASSET_TBL } = require("../../../../../constants/strings");
const {
    pagination,
    sort,
  } = require("../../../../../globalFunction/paginationSort");


exports.productMasterQuery = (filters, limit, skip, isCount = false, sort, orderby) => {
    let fields = `pm.id,ua.name as underlying_name,sh.name as shape_name,concat(si.start_range,'-',si.end_range) as size_name,cl.name as clarity_name ,co.name as colour_name, pm.is_active, pm.updated_at`;
    let count = `COUNT(*)`;
    let sortBy = (orderby!==undefined && sort!== undefined) ? `ORDER BY ${orderby} ${sort}` : "ORDER BY updated_at desc";
    return `
    SELECT ${isCount ? count : "*"} FROM (
        SELECT ${fields}
      FROM ${PRODUCT_MASTER_TBL} AS pm
      left join ${UNDERLYING_ASSET_TBL} ua on ua.id=pm.underlying_id
      left join ${SHAPE_TBL} sh on sh.id=pm.shape
      left join ${SIZE_TBL} si on si.id=pm.size
      left join ${CLARITY_TBL} cl on cl.id = pm.clarity
      left join ${COLOUR_TBL} co on co.id=pm.colour
    ) as subquery
      WHERE ${filters} 
       is_active = true
      ${!isCount ? sortBy : ""}
      ${!isCount ? `LIMIT ${limit} OFFSET ${skip}` : ""}
    `;
};