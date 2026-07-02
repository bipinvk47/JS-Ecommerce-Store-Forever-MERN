export const sendSuccess = (res, payload = {}) => {
  return res.json({ success: true, ...payload });
};

export const sendFailure = (res, message, statusCode = 200) => {
  return res.status(statusCode).json({ success: false, message });
};

export const handleControllerError = (res, error, context) => {
  console.error(`[${context}]`, error);
  return sendFailure(res, error.message);
};

export const requireFields = (body, fields) => {
  const missing = fields.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || value === "";
  });

  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(", ")}`;
  }

  return null;
};
