const { CONFIGURATION_TBL } = require("../../../../constants/strings");

exports.selectQuery = `Select id, percentage,percentage_status,count,count_status,days_count,days_type,threshold_value, updated_by from ${CONFIGURATION_TBL} Where is_active = true`;

