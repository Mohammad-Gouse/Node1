
exports.convertJsonToSqlWhere = (query) => {
  const conditions = [];

  for (let key in query) {
    if (query.hasOwnProperty(key)) {
      const value = query[key];
      if (typeof value === 'object') {
        const operator = value.operator || '=';
        const comparisonValue = value.value;
        if (value.type = "date") {
          key = `DATE(${key})`
        }
        if (operator === '>=') {
          conditions.push(`${key} >= '${comparisonValue}'`);
        } else if (operator === '<=') {
          conditions.push(`${key} <= '${comparisonValue}'`);
        } else if (operator === 'between' && Array.isArray(comparisonValue) && comparisonValue.length === 2) {
          conditions.push(`${key} BETWEEN ${comparisonValue[0]} AND ${comparisonValue[1]}`);
        } else {
          conditions.push(`${key} ${operator} '${comparisonValue}'`);
        }
      } else {
        // If the value is not an object, assume it's a direct comparison
        conditions.push(`${key} = '${value}'`);
      }
    }
  }

  // Construct the SQL WHERE clause
  let whereClause = '';
  if (conditions.length > 0) {
    whereClause = `WHERE ${conditions.join(' AND ')}`;
  }

  return { whereClause };
}