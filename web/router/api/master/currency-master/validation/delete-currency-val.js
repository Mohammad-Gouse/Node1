const { query } = require("../../../../../../db/pg");
const { CurrencyExistQuery } = require("../query");

exports.deleteCurrencyValidation = async(ctx,next) => {
  try {
    const currencyId = ctx.request.params.id;
    const found = await checkCurrencyExist(currencyId);
    if (!found) return ctx.error(ctx, "Currency not found!");
    await next();
  } catch (error) {
    throw new Error(error.message);
  }
}

const checkCurrencyExist = async(currencyId) => {
  try {
    const currencyCount = await query(CurrencyExistQuery(currencyId));
    if (currencyCount.rowCount > 0) return true;
    return false;
  } catch (error) {
    throw new Error(error.message);
  }
}