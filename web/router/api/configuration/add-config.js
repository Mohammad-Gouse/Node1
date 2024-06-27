
const { CONFIGURATION_TBL } = require("../../../../constants/strings");
const { query, insert, update } = require("../../../../db/pg");
const { createUpdate } = require("../../../../globalFunction/createdUpdated");
const { selectQuery } = require("./query");

const configCountObj = async (body, ctx) => {
  body.percentage_status = false
  body.count_status = true
  body.created_by = ctx.userId
  body.updated_by = ctx.userId
  return body;
};

const updateCountPayload = async(body,ctx) => {
  return {
    count: body.count,
    count_status: true,
    percentage_status: false,
    days_count: body.days_count,
    days_type: body.days_type,
    threshold_value: body.threshold_value,
    updated_by: ctx.userId
  }
}

const updatePercentPayload = async(body,ctx) => {
  return {
    percentage: body.percentage,
    percentage_status: true,
    count_status: false,
    days_count: body.days_count,
    days_type: body.days_type,
    threshold_value: body.threshold_value,
    updated_by: ctx.userId
  }
}

const updateCondition = (payload, rateId) => {
  const whereClause = {};
  let length = Object.keys(payload).length;
  whereClause.text = `WHERE id=$${length + 1}`;
  whereClause.values = [rateId];
  return whereClause;
}

const addConfig = async (ctx) => {
  try {
    const body = ctx.request.body;
    const outcome = await query(selectQuery);
    
    if(outcome.rowCount===0){
      const data = (('count' in body && body.count !== null && body.count !== '')) ? await configCountObj(body, ctx) : await createUpdate(body,ctx) ;
      await insert({
        data,
        tableName: CONFIGURATION_TBL,
        returnClause: ['id']
      });
      return ctx.success(ctx, "Data inserted Successfully");
    } 
    
    const payload = (('count' in body)) ? await updateCountPayload(body,ctx): await updatePercentPayload(body,ctx);
    const whereClause = updateCondition(payload,outcome.rows[0].id);
    await update({
      whereClause,
      tableName: CONFIGURATION_TBL,
      data: payload
    })
    return ctx.success(ctx, "Data updated Successfully");
  } catch (error) {
    return ctx.error(ctx, "Error occurred while inserting data", error.message);
  }
}

const handler = async (ctx, next) => {
  await addConfig(ctx);
  await next();
}

module.exports = {
  handler,
}