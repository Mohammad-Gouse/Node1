const {query} = rootRequire('db').pg;
const { UNDERLYING_ASSET } = require('../../../../../../constants/strings');
const {addAssetVal} = require('./add-asset-joi');

exports.assetJoiValidation = async (ctx,next) => {
  try {
    let body = ctx.request.body;
    const {value,error} = await addAssetVal(body);
    if (error) return ctx.error(ctx, "Validation Error", error.message);
    const check = await checkDuplicate(value.name);
    if (check) return ctx.error(ctx, "Underlying asset already exists");
    await next();
  } catch (error) {
    throw new Error(error.message) ;
  }
}

const checkDuplicate = async (asset) => {
    try {
        const assetCount = await query(`SELECT * FROM ${UNDERLYING_ASSET} WHERE name=$1 and is_active=true`,[asset]);
        if (assetCount.rowCount > 0) return true;
        return false;
    } catch (error) {
        throw new Error(error.message);
    }
}

