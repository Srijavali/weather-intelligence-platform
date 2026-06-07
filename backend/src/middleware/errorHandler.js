import AppError from "../utils/AppError.js";

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_JSON",
        message: "Malformed JSON payload"
      }
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message
      }
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong"
    }
  });
};

export default errorHandler;