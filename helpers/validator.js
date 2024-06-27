const validator = (schema) => (data) => schema.validate(data, ({ abortEarly: false }))

module.exports = {
  validator
}