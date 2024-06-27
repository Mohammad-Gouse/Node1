exports.fileVal = async (ctx, next) => {
  try {
    if (!ctx.request.files.file) return ctx.error(ctx, "File not received");
    await next();
  } catch (error) {
    throw new Error(error.message);
  }
}
