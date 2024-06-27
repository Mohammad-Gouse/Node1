const { insert } = rootRequire("db").pg;
const { UNDERLYING_ASSET_TBL: UNDERLYING_ASSET } = require("../../../../../constants/strings");
const { createUpdate } = require("../../../../../globalFunction/createdUpdated");
const { generateTagAsset: generateTag } = require("../../../../../utils/generate-tag");

const assetObj = (name, description) => {
  try {
    let asset = {
      name: name,
      description: description,
      tag: generateTag(description),
    };
    return asset;
  } catch (error) {
    throw new Error(error.message);
  }
}

const addAsset = async (ctx) => {
  try {
    let body = ctx.request.body;
    const data = assetObj(body.name, body.description);
    await insert({
      data: await createUpdate(data,ctx),
      tableName: UNDERLYING_ASSET,
      returnClause: ["id"],
    });
    return ctx.success(ctx, "Underlying asset added successfully");
  } catch (error) {
    return ctx.error(ctx, "Error occurred while adding underlying asset", error.message);
  }
};

const handler = async (ctx, next) => {
  await addAsset(ctx);
  await next();
};

module.exports = {
  handler,
}
