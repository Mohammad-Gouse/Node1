const bcrypt = require("bcrypt");

exports.encrypt = async (password) => {
  try {
    const saltRounds = 6;
    const hash = await bcrypt.hash(password, saltRounds);

    return hash;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.decryptPassword = async (userPassword, encryptPassword) => {
  try {
    const result = await bcrypt.compare(userPassword, encryptPassword);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}
