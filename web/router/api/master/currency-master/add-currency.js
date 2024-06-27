const { insert } = rootRequire("db").pg;
const { CURRENCY_MASTER_TBL } = require("../../../../../constants/strings");
const { createUpdate } = require("../../../../../globalFunction/createdUpdated");
const { generateTagCurrencyMaster } = require("../../../../../utils/generate-tag");

const currencyObj = async (name) => {
  try {
    let currencyMaster = {
      name: name,
      tag: generateTagCurrencyMaster(name),
    };
    return currencyMaster;
  } catch (error) {
    throw new Error(error.message);
  }
}

const addCurrencyMaster = async (ctx) => {
  try {
    let body = ctx.request.body;
    const data = await currencyObj(body.currency);
    await insert({
      data: await createUpdate(data,ctx),
      tableName: CURRENCY_MASTER_TBL,
      returnClause: ["id"],
    });
    return ctx.success(ctx, "Currency added successfully");
  } catch (error) {
    return ctx.error(ctx, "Error occurred while adding currency", error.message);
  }
};

const handler = async (ctx, next) => {
  await addCurrencyMaster(ctx);
  await next();
};

module.exports = {
  handler,
}
