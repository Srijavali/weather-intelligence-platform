// src/utils/retry.js

import logger from "./logger.js";

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error) => {
  // Axios/network errors
  if (!error.response) {
    return true;
  }

  const status = error.response.status;

  // Retry rate limiting and server failures
  return status === 429 || status >= 500;
};

export const retry = async (
  operation,
  {
    retries = 3,
    initialDelayMs = 500,
    correlationId = "unknown"
  } = {}
) => {
  let attempt = 0;
  let delay = initialDelayMs;

  while (attempt <= retries) {
    try {
      return await operation();
    } catch (error) {
      const retryable = isRetryableError(error);

      if (!retryable || attempt === retries) {
        logger.error("Retry operation failed", {
          correlationId,
          attempt: attempt + 1,
          retryable,
          error: error.message,
          statusCode: error.response?.status
        });

        throw error;
      }

      logger.warn("Retrying external API request", {
        correlationId,
        attempt: attempt + 1,
        nextDelayMs: delay,
        statusCode: error.response?.status,
        error: error.message
      });

      await sleep(delay);

      delay = Math.min(delay * 2, 5000); // exponential backoff
      attempt++;
    }
  }
};

export default retry;