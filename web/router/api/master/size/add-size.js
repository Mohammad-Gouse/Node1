const { SIZE_TBL } = require("../../../../../constants/strings");
const { bulkInsert, query } = require("../../../../../db/pg");
const { createUpdate, bulkInsertCreateUpdate } = require("../../../../../globalFunction/createdUpdated");
const { generateTagSize } = require("../../../../../utils/generate-tag");
const { insert } = rootRequire('db').pg;

const sizeObj = (carat) => {
  return {
    carat: carat,
    tag: generateTagSize(carat)
  };
};

const addSize = async (ctx) => {
  try {
    const body = ctx.request.body;
    const startRange = parseFloat(body.startRange);
    const endRange = parseFloat(body.endRange);
    let data = [];
    for (let size = startRange; size <= endRange + 0.001; size += 0.01) {
      let sizea = size.toFixed(2);
      let sizeData = sizeObj(sizea)
      data.push(sizeData)
    }
    await query('BEGIN');
    const result = await bulkInsert({
      data: await bulkInsertCreateUpdate(data,ctx),
      tableName: SIZE_TBL,
      returnClause: ['id']
    });
    await query('COMMIT');
    return ctx.success(ctx, "Size added successfully", result.rowCount);
  } catch (error) {
    await query('ROLLBACK');
    return ctx.error(ctx, "Error occurred while adding size", error.message);
  }
}

const handler = async (ctx, next) => {
  await addSize(ctx);
  await next();
}

module.exports = {
  handler,
}