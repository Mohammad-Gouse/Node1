const { insert } = rootRequire("db").pg;
const {createUpdate} = require('../../../../../globalFunction/createdUpdated');
const { SHAPE_TBL } = require("../../../../../constants/strings");
const { generateTagShape: generateTag } = require("../../../../../utils/generate-tag");

const shapeObj = async (name) => {
  try {
    let shape = {
      name: name,
      tag: await generateTag(name),
    };
    return shape;
  } catch (error) {
    throw new Error(error.message);
  }
}

const addShape = async (ctx) => {
  try {
    let body = ctx.request.body;
    const data = await shapeObj(body.shape);
    await insert({
      data: await createUpdate(data,ctx),
      tableName: SHAPE_TBL,
      returnClause: ["id"],
    });
    return ctx.success(ctx, "Shape added successfully");
  } catch (error) {
    return ctx.error(ctx, "Error occurred while adding shape", error.message);
  }
};

const handler = async (ctx, next) => {
  await addShape(ctx);
  await next();
};

module.exports = {
  handler,
}