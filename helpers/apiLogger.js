const { insert, update } = rootRequire('db').pg;
const { API_LOGGER_TABLE } = rootRequire('constants');

async function logAPIRequest(requestObj) {
  try {
    const { rows: requestLog } = await insert({
      tableName: API_LOGGER_TABLE,
      data: requestObj,
      returnClause: ['id'],
    });
    return requestLog[0].id;
  } catch (e) {
    logger.error(`Error while inserting the api request. Error: ${e.message || e} Req: ${JSON.stringify(requestObj, null, 2)}`)
  }
}
async function logAPIResponse({ updateObj, loggerId }) {
  /** Enriching the where clause */
  try {
    const whereClause = {};
    let length = Object.keys(updateObj).length;
    whereClause.text = `WHERE 1 =1 AND id=$${length + 1}`;
    whereClause.values = [loggerId];
    const { rows: responseLog } = await update({
      tableName: API_LOGGER_TABLE,
      data: updateObj,
      whereClause,
      returnClause: ['id'],
    });
    return responseLog[0].id;
  } catch (e) {
    logger.error(`Error while inserting the api response. Error: ${e.message || e} Res: ${JSON.stringify(updateObj, null, 2)}`)
  }
}
module.exports = {
  logAPIRequest,
  logAPIResponse,
};