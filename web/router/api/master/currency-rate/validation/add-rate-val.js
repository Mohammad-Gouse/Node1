const {query} = rootRequire('db').pg;
const { CURRENCY_RATE_TBL } = require('../../../../../../constants/strings');
const {addRateVal} = require('./add-rate-joi');

exports.rateJoiValidation = async (ctx,next) => {
  try {
    let body = ctx.request.body;
    const {value,error} = await addRateVal(body);
    if (error) return ctx.error(ctx, "Validation Error", error.message);

    const check = await checkDuplicate(value.currency_1, value.currency_2);
    if (check) return ctx.error(ctx, "Currency rate already exists");
    await next();
  } catch (error) {
    throw new Error(error.message) ;
  }
}

const checkDuplicate = async (currency1, currency2) => {
    try {
        const rateCount = await query(
          `SELECT * FROM ${CURRENCY_RATE_TBL} WHERE currency_1='${currency1}' AND currency_2='${currency2}' and is_active=true`
        );
        if (rateCount.rowCount > 0) return true;
        return false;
    } catch (error) {
        throw new Error(error.message);
    }
}
