const { query } = rootRequire("db").pg;
const { fetchReportingUser } = require('./query')

async function getReportingUser(id) {
  try {
    const text = fetchReportingUser();
    const { rows, rowCount } = await query(text, [id]);
    if (rows[0].user_id === null) return [];
    else return rows[0].user_id;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  getReportingUser,
};
