const createUpdate = async (obj, body) => {
    obj.created_by = body?.userId ?? process.env.DEFAULT_USER_ID
    obj.updated_by = body?.userId ?? process.env.DEFAULT_USER_ID
    return obj
}

const createUpdateUser = async (obj, body) => {
    obj.created_by = body?.userId ?? process.env.DEFAULT_USER_ID
    obj.updated_by = body?.userId ?? process.env.DEFAULT_USER_ID
    obj.user_id = body?.userId ?? process.env.DEFAULT_USER_ID

    return obj
}

const updateBy = async (obj, body) => {
    obj.updated_by = body?.userId ?? process.env.DEFAULT_USER_ID
    return obj
}

const bulkInsertCreateUpdate = async (obj,body) => {
    for(const i of obj){
        i.created_by = body?.userId ?? process.env.DEFAULT_USER_ID
        i.updated_by = body?.userId ?? process.env.DEFAULT_USER_ID
    }
    return obj
}

const bulkInsertUpdateBy = async (obj, body) => {
    for(const i of obj){
        i.updated_by = body?.userId ?? process.env.DEFAULT_USER_ID
    }
    return obj
}

module.exports={
    createUpdate,
    updateBy,
    bulkInsertCreateUpdate,
    bulkInsertUpdateBy,
    createUpdateUser
}