function getAndSeparatedWhereClause(obj) {
	const params = [];
	let text;
	Object.entries(obj).forEach((obj) => {
		params.push(` ${obj[0]} = '${obj[1]}' `);
	}, this);
	text =`${params.join("AND")}`
	return text;
}

module.exports = (obj) => {
	obj.getAndSeparatedWhereClause = getAndSeparatedWhereClause
};
