const { COLOUR_TBL } = require("../../../../../constants/strings");
const { insert } = require("../../../../../db/pg");
const { createUpdate } = require("../../../../../globalFunction/createdUpdated");
const { generateTagColour } = require("../../../../../utils/generate-tag");

const colourObj = (name) => {
  try {
    let colour = {
      name: name,
      tag: generateTagColour(name)
    }
    return colour;
  } catch (error) {
    throw new Error(error.message);
  }
}

const addColour = async (ctx) => {
  try {
    const body = ctx.request.body;
  const data = colourObj(body.colour);
  await insert({
    data: await createUpdate(data,ctx),
    tableName: COLOUR_TBL,
    returnClause: ['id']
  })
  return ctx.success(ctx, "Colour added successfully");
  } catch (error) {
    return ctx.error(ctx, "Error occurred while adding colour",ctx.message);
  }
}

const handler = async (ctx,next) => {
  await addColour(ctx);
  await next();
}

module.exports = {
  handler,
}