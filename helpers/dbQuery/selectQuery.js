const { Pool } = require('pg');
const Boom = require('@hapi/boom');



const {
  getAndSeparatedWhereClause
} = require('./queryHelperFunction');

const envsWithQueryLoggingEnabled = ['production'];

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  max: process.env.PGMAXCONNECTION,
  idleTimeoutMillis: process.env.PGIDLETIMEOUT,
  connectionTimeoutMillis: process.env.PGCONNECTIONTIMEOUT,
});



pool.on('error', (err) => {
  logger.error(`Postgres connection error on client - ${err.message}`);
  throw err;
});


/**
 * Notice in the example below no releaseCallback was necessary.
 * The pool is doing the acquiring and releasing internally.
 * I find pool.query to be a handy shortcut in a lot of situations.
 * Do not use pool.query if you need transactional integrity:
 * the pool will dispatch every query passed to pool.query on the first available idle client.
 * Transactions within PostgreSQL are scoped to a single client.
 * so dispatching individual queries within a single transaction across
 * multiple, random clients will cause big problems in your app and not work.
 */
/**
 * @param  {string} text
 * @param  {array} params
 */
function query(text, params, query_replica = false) {
  if (envsWithQueryLoggingEnabled.indexOf(process.env.DEV_ENV) >= 0) {
    logger.info(`${query_replica ? 'Replica:' : 'Master:'} ${text}`);
    logger.info(`${query_replica ? 'Replica:' : 'Master:'} ${params}`);
  }
  return query_replica ? replica_pool.query(text, params) : pool.query(text, params);
}

async function select({ tableName, selectColumnClause, limit, startIndex, whereClause, whereAndLikeClause, orderByClause, asc = 0, desc = 1 }) {
  if (!tableName || tableName.constructor !== String || tableName.length === 0) {
    throw Boom.badRequest('Please provide string value with more than 0 characters for table name')
  }
  if (!selectColumnClause || selectColumnClause.constructor !== Array || selectColumnClause.length === 0) {
    throw Boom.badRequest('Please provide array of values for table feild name to fetch');

  }
  let text = `SELECT ${selectColumnClause.join(",")} FROM ${tableName}`
  let values = []
  if (whereClause && whereClause.constructor === Object && Object.keys(whereClause).length > 0 && whereAndLikeClause && whereAndLikeClause.constructor === Object && Object.keys(whereAndLikeClause).length > 0) {
    text = `${text} WHERE ${getAndSeparatedWhereClause(whereClause)} AND ${whereAndLikeClause.text}`
  }

  else if (whereClause && whereClause.constructor === Object && Object.keys(whereClause).length > 0) {
    text = `${text} WHERE ${getAndSeparatedWhereClause(whereClause)}`
  }

  else if (whereAndLikeClause && whereAndLikeClause.constructor === Object && Object.keys(whereAndLikeClause).length > 0) {
    text = `${text} WHERE ${whereAndLikeClause.text}`
  }

  if (orderByClause && orderByClause.constructor === Array && orderByClause.length > 0) {

    if (asc) {
      text = `${text} ORDER BY ${orderByClause}`
    }

    else if (desc) {
      text = `${text} ORDER BY ${orderByClause.join(',')} DESC`
    }

  }

  if (limit && (startIndex || 1)) {
    text = `${text} LIMIT '${limit}' OFFSET '${startIndex}'`
  }

  return await query(text, values);
}

module.exports = {
  pool,
  query,
  select,
};