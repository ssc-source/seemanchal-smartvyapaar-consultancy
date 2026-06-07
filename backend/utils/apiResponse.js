exports.sendSuccess = (res, data = {}, statusCode = 200, meta) => {
  const payload = { success: true, data };
  if (meta) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

exports.sendMessage = (res, message, statusCode = 200, data) => {
  const payload = { success: true, message };
  if (data !== undefined) payload.data = data;
  return res.status(statusCode).json(payload);
};

exports.sendError = (res, message, statusCode = 500, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
