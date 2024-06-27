const { query } = require("../../../../../../db/pg");
const { assetExistQuery } = require("../query");

exports.deleteAssetValidation = async(ctx,next) => {
  try {
    const assetId = ctx.request.params.id;
    const found = await checkAssetExist(assetId);
    if (!found) return ctx.error(ctx, "Underlying asset not found!");
    await next();
  } catch (error) {
    throw new Error(error.message);
  }
}

const checkAssetExist = async(assetId) => {
  try {
    const assetCount = await query(assetExistQuery(assetId));
    if (assetCount.rowCount > 0) return true;
    return false;
  } catch (error) {
    throw new Error(error.message);
  }
}