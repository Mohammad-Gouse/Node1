const { query } = require("../../../../../../db/pg");
const { RateExistQuery } = require("../query");

exports.updateRatePriceValidation = async(ctx,next) => {
  try {
    const rateId = ctx.request.params.id;
    const found = await checkRateExist(rateId);
    if (!found) return ctx.error(ctx, "Currency rate not found!");
    await next();
  } catch (error) {
    throw new Error(error.message);
  }
}

const checkRateExist = async(rateId) => {
  try {
    const rateCount = await query(RateExistQuery(rateId));
    if (rateCount.rowCount > 0) return true;
    return false;
  } catch (error) {
    throw new Error(error.message);
  }
}