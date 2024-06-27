const {query} = rootRequire('db').pg;
const { SHAPE_TBL } = require('../../../../../../constants/strings');
const {addShapeVal} = require('./add-shape-joi');

exports.shapeJoiValidation = async (ctx,next) => {
  try {
    let body = ctx.request.body;
    const {value,error} = await addShapeVal(body);
    if (error) return ctx.error(ctx, "Validation Error", error.message);
    const check = await checkDuplicate(value.shape);
    if (check) return ctx.error(ctx, `${body.shape} Shape already exists`);
    await next();
  } catch (error) {
    throw new Error(error.message) ;
  }
}

const checkDuplicate = async (shape) => {
    try {
        const shapeCount = await query(`SELECT * FROM ${SHAPE_TBL} WHERE name=$1 and is_active=true`,[shape]);
        if (shapeCount.rowCount > 0) return true;
        return false;
    } catch (error) {
        throw new Error(error.message);
    }
}

