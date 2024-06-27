const { CLARITY_TBL } = require("../../../../../constants/strings");
const { insert } = require("../../../../../db/pg");
const { createUpdate } = require("../../../../../globalFunction/createdUpdated");
const { generateTagClarity } = require("../../../../../utils/generate-tag");

const clarityObj = async (clarityName) => {
  return {
    name: clarityName,
    tag: generateTagClarity(clarityName)
  }
}

const addClarity = async (ctx) => {
  try {
    const body = ctx.request.body;
  const data = await clarityObj(body.clarity);
  await insert({
    data: await createUpdate(data,ctx),
    tableName: CLARITY_TBL,
    returnClause: ['id']
  });
  return ctx.success(ctx, "Clarity added successfully");
  } catch (error) {
    return ctx.error(ctx,"Error occurred while adding clarity",error.message);
  }
}

const handler = async(ctx,next) => {
  await addClarity(ctx);
  await next();
}

module.exports = {
  handler,
}