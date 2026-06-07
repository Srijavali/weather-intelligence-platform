// src/middleware/requestLogger.js

import logger from "../utils/logger.js";

const requestLogger = (req, res, next) => {
  const startTime =
    req.requestStartTime || process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs =
      Number(process.hrtime.bigint() - startTime) / 1_000_000;

    const metadata = {
      correlationId: req.correlationId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      ip:
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.ip
    };

    if (res.statusCode >= 500) {
      logger.error("HTTP Request Completed", metadata);
      return;
    }

    if (res.statusCode >= 400) {
      logger.warn("HTTP Request Completed", metadata);
      return;
    }

    logger.info("HTTP Request Completed", metadata);
  });

  next();
};

export default requestLogger;