const { insert } = rootRequire("db").pg;
const { CURRENCY_RATE_TBL, CURRENCY_MASTER_TBL } = require("../../../../../constants/strings");
const { query } = require("../../../../../db/pg");
const { createUpdate } = require("../../../../../globalFunction/createdUpdated");
const { generateTagCurrencyRate } = require("../../../../../utils/generate-tag");

const currencyObj = async (currency1,currency2,price) => {
  try {
    let CurrencyRate = {
      currency_1: currency1,
      currency_2: currency2,
      price: price,
      tag: generateTagCurrencyRate(currency1,currency2),
    };
    return CurrencyRate;
  } catch (error) {
    throw new Error(error.message);
  }
}

const addCurrencyRate = async (ctx) => {
  try {
    let body = ctx.request.body;
    const data = await currencyObj(body.currency_1,body.currency_2,body.price);
    await insert({
      data: await createUpdate(data,ctx),
      tableName: CURRENCY_RATE_TBL,
      returnClause: ["id"],
    });
    return ctx.success(ctx, "Currency rate added successfully");
  } catch (error) {
    return ctx.error(ctx, "Error occurred while adding currency rate", error.message);
  }
};

const handler = async (ctx, next) => {
  await addCurrencyRate(ctx);
  await next();
};

module.exports = {
  handler,
}
