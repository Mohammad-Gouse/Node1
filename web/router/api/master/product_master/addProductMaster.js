const { insert } = rootRequire("db").pg;
const { PRODUCT_MASTER_TBL } = require("../../../../../constants/strings");
const { createUpdate } = require("../../../../../globalFunction/createdUpdated");

const addProductMasterService = async (ctx) => {
  try {
    const data = ctx.request.body;    
    await insert({
        data: await createUpdate(data,ctx),
        returnClause: ['id'],
        tableName: PRODUCT_MASTER_TBL,
    });
    return ctx.success(ctx, 'Product added successfully')
  } catch (error) {
    return ctx.error(ctx, error.message);
  }
};


const handler = async (ctx, next) => {
    await addProductMasterService(ctx);
    await next();
};
  
module.exports = {
  handler,
};
  