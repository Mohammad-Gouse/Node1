const { PRODUCT_MASTER_TBL } = require("../../../../../constants/strings");

const {query} = rootRequire('db').pg;

async function checkDuplicateEdit(name,table_name,id){
    const res = await query(`select * from ${table_name} where lower(name) = lower($1) and is_active = true and id != $2`,[name,id]);
    if(res.rowCount>0){
        return 1
    }else{
        return 0
    }
}

async function checkDuplicate(shape, size, clarity, color){
  try {
    const res = await query(`select * from ${PRODUCT_MASTER_TBL} where shape = $1 and size=$2 and clarity=$3 and colour=$4 and is_active = true`,[shape,size,clarity,color]);
    if(res.rowCount>0){
      return true
    }
    return false;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports={
    checkDuplicate,
    checkDuplicateEdit
}