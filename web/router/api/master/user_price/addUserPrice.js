const { insert } = rootRequire("db").pg;
const { query } = rootRequire("db").pg;
const {
  createUpdateUser,
  createUpdate,
} = require("../../../../../globalFunction/createdUpdated");

const {
  USER_PRICE_TBL,
  PRODUCT_MASTER_TBL,
} = require("../../../../../constants/strings");

// const addUserPriceService = async (ctx) => {
//   try {
//     const data = ctx.request.body;
//     // const body=getProductMasterId(ctx)
//     // const data = ctx.request.body;
//     for (const tag of data.tags) {
//       console.log({ tag });
//       const userData = {
//         product_id: tag.product_Id,
//         price: tag.price,
//         created_by: ctx.userId,
//         updated_by: ctx.userId,
//         user_id: ctx.userId,
//       };
//       // console.log(await createUpdate(body,ctx))
//       await insert({
//         data: await createUpdate(userData, ctx),
//         returnClause: ["id"],
//         tableName: USER_PRICE_TBL,
//       });
//       return ctx.success(ctx, "User added Price successfully");
//     }
//   } catch (error) {
//     return ctx.error(ctx, error.message);
//   }
// };

const addUserPriceService = async (ctx) => {
  try {
    const data = ctx.request.body;
    for (const tag of data.tags) {
      console.log({ tag });
      const userData = {
        product_id: tag.product_id,
        price: tag.price,
        created_by: ctx.userId,
        updated_by: ctx.userId,
        user_id: ctx.userId,
      };
      await insert({
        data: await createUpdate(userData, ctx),
        returnClause: ["id"],
        tableName: USER_PRICE_TBL,
      });
    }
    // Move the success response outside of the loop
    return ctx.success(ctx, "User added Price successfully");
  } catch (error) {
    // Handle errors
    return ctx.error(ctx, error.message);
  }
};

const getProductMasterId = async (ctx) => {
  try {
    const data = ctx.request.body;
    const price = data.price;
    delete data.price;

    const queryText = `
      SELECT id FROM ${PRODUCT_MASTER_TBL}
      WHERE shape = $1 AND size = $2 AND clarity = $3 AND colour = $4
    `;
    const values = [data.shape, data.size, data.clarity, data.colour];

    const result = await query(queryText, values);
    const productId = result.rows[0]?.id;

    if (productId) {
      let data = {
        product_id: productId,
        price: price,
        created_by: ctx.userId,
        updated_by: ctx.userId,
        user_id: ctx.userId,
      };
      return data;
    } else {
      ctx.status = 500;
      ctx.body = {
        status: false,
        message: "Prodct Not Found",
      };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      status: false,
      message: error.message,
    };
  }
};

const handler = async (ctx, next) => {
  await addUserPriceService(ctx);
  await next();
};

module.exports = {
  handler,
};
