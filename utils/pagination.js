/* eslint-disable no-param-reassign */

/**
 *  Pagination Helper
 */

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 1000;

/**
 *
 * @param {number} page Page Number
 * @param {number} hitsPerPage Data Limit
 */
function getSkipAndLimit(page, hitsPerPage) {
  hitsPerPage = parseInt(hitsPerPage) || DEFAULT_PAGE_SIZE;
  page = parseInt(page) || 1;
  const limit = hitsPerPage;
  const skip = (page - 1) * hitsPerPage;
  if (limit > MAX_PAGE_SIZE) {
    throw Error(`hitsPerPage can not exceed max limit of ${MAX_PAGE_SIZE}`);
  }
  return {
    limit,
    skip,
  };
}

/**
 *
 * @param {number} page Page Number
 * @param {Query<number, Document<any, {}>, {}>} totalCount Data Count
 * @param {number} hitsPerPage Data Limit
 */
function getPaginationResponseObject(page, displayCount, totalCount, hitsPerPage, data) {
  hitsPerPage = hitsPerPage || DEFAULT_PAGE_SIZE;
  return {
    page: parseInt(page),
    hitsPerPage,
    displayCount: parseInt(displayCount),
    totalDataCount: parseInt(totalCount),
    totalPages: Math.ceil(totalCount / hitsPerPage),
    data,
  };
}

function getDataCount(countResult) {
  return countResult.rows && countResult.rows.length > 0
    ? countResult.rows[0].count
    : 0;
}

function getDetailResponse(countResult) {
  return countResult.rows.length > 0 ? countResult.rows[0] : {};
}

module.exports = {
  getDataCount,
  getSkipAndLimit,
  getDetailResponse,
  getPaginationResponseObject,
};
