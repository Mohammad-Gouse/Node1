const createUpdate = async (body, value) => {
    body.created_by = value?.created_by ?? 1
    body.updated_by = value?.updated_by ?? 1
    return body
}


module.exports = {
    createUpdate
}