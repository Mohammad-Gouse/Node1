const jwt = require("jsonwebtoken");

const verifyToken = async (ctx, next) => {
  let token = ctx.headers.authorization;
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: "Token not found!" };
    return;
  }
  token = token.replace(/^Bearer\s+/, "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN_SOCKET);
    ctx.user = decoded;
    ctx.userId = decoded.userId;  
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { error: "User is unauthorized. Token is invalid!"};
    return;
  }
};

module.exports = verifyToken;