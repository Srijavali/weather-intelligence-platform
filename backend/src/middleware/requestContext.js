// src/middleware/requestContext.js

import crypto from "crypto";

const requestContext = (req, res, next) => {
  const incomingCorrelationId = req.headers["x-correlation-id"];

  const correlationId =
    incomingCorrelationId ||
    crypto.randomUUID();

  req.correlationId = correlationId;
  req.requestStartTime = process.hrtime.bigint();

  res.setHeader(
    "X-Correlation-Id",
    correlationId
  );

  next();
};

export default requestContext;