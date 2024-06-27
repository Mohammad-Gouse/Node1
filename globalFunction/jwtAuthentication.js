const jwt = require("jsonwebtoken");
// const { checkIfVaildJwt, setJwtInvalid } = require("./query");
// const { query } = rootRequire("db").pg;

async function authenticateToken(ctx, next) {
  // Extract the token from the Authorization header
  const authHeader = ctx.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    if (!token) return ctx.success(ctx, `Token missing`, null, null, 200);
    // const text = checkIfVaildJwt();
    // const res = await query(text, [token]);
    // if (res.rowCount > 0)
    //   return ctx.success(ctx, `Invalid token`, null, null, 200);

    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN_SOCKET); // Verify and decode the token
    ctx.state.user = decoded; // Add the decoded user information to the context state
    await next();
  } catch (error) {
    // if (error instanceof jwt.TokenExpiredError) {
    //   const text = setJwtInvalid();
    //   await query(text, [token]); // Handle expired token
    // }
    return ctx.success(ctx, `Invalid token`, null, null, 200);
  }
}

module.exports = {
  authenticateToken,
};
