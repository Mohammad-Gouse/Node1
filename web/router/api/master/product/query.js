exports.selectQuery = (tableName) => `SELECT id,name FROM ${tableName}`

exports.selectSizeQuery = (tableName) => `SELECT id,carat FROM ${tableName}`