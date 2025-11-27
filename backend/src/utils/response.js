export const success = (res, data, message = "OK") => {
  return res.json({
    status: "success",
    message,
    data,
  });
};

export const error = (res, errorMessage = "Something went wrong", code = 500) => {
  return res.status(code).json({
    status: "error",
    message: errorMessage,
  });
};
