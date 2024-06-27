const {query} = rootRequire('db').pg;
const { CURRENCY_MASTER_TBL } = require('../../../../../../constants/strings');
const {addCurrencyVal} = require('./add-currency-joi');

exports. currencyJoiValidation = async (ctx,next) => {
  try {
    let body = ctx.request.body;
    const {value,error} = await addCurrencyVal(body);
    if (error) return ctx.error(ctx, "Validation Error", error.message);
    const check = await checkDuplicate(value.currency);
    if (check) return ctx.error(ctx, "Currency already exists");
    await next();
  } catch (error) {
    throw new Error(error.message) ;
  }
}

const checkDuplicate = async (currency) => {
    try {
        const currencyCount = await query(`SELECT * FROM ${CURRENCY_MASTER_TBL} WHERE name=$1 and is_active=true`,[currency]);
        if (currencyCount.rowCount > 0) return true;
        return false;
    } catch (error) {
        throw new Error(error.message);
    }
}

