const { query } = rootRequire('db').pg;
const { getAllTagsQuery, getTagCountQuery, productMasterQuery } = require("./query");
const { getDataCount, getSkipAndLimit, getPaginationResponseObject } = require("../../../../../utils/pagination");

const getProductMasterDetails = async (ctx) => {
    try {
      const page = ctx.request.params.num;
      const sort = ctx.request.query.sort;
      const sortBy = ctx.request.query.sortBy;
      const filterBy = ctx.request.query.filterBy;
      const hitsPerPage = ctx.request.query.hitsPerPage;
      const filterValue = ctx.request.query.filterValue;
      const {limit, skip} = getSkipAndLimit(page, hitsPerPage);
      let whereCondition = filterBy ? `${filterBy} ILIKE '%${filterValue}%' AND` : "";
      const count = await query(productMasterQuery(whereCondition, null, null, true));
      const productQuery = productMasterQuery(whereCondition, limit, skip, false, sortBy, sort);
      let {rows,rowCount} = await query(productQuery);
      let result = getPaginationResponseObject(page, rowCount, getDataCount(count), hitsPerPage, rows);
      return ctx.success(ctx, 'Product details', result);
    } catch (error) {
      return ctx.error(ctx, "Error occurred while getting product master details", error.message);
    }
  };
  
  const handler = async (ctx, next) => {
      await getProductMasterDetails(ctx);
      await next();
  };
    
  module.exports = {
    handler,
  };