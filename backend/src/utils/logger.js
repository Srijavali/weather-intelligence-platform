// src/utils/logger.js

import env from "../config/env.js";

const sanitizeMetadata = (metadata = {}) => {
  const clone = { ...metadata };

  delete clone.authorization;
  delete clone.apiKey;
  delete clone.password;
  delete clone.token;

  return clone;
};

const formatLog = (level, message, metadata = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...sanitizeMetadata(metadata)
  };

  return JSON.stringify(logEntry);
};

const writeLog = (level, message, metadata = {}) => {
  const output = formatLog(level, message, metadata);

  switch (level) {
    case "error":
      console.error(output);
      break;

    case "warn":
      console.warn(output);
      break;

    default:
      console.log(output);
  }
};

export const logger = {
  info(message, metadata = {}) {
    writeLog("info", message, metadata);
  },

  warn(message, metadata = {}) {
    writeLog("warn", message, metadata);
  },

  error(message, metadata = {}) {
    writeLog("error", message, metadata);
  },

  debug(message, metadata = {}) {
    if (env.NODE_ENV !== "production") {
      writeLog("debug", message, metadata);
    }
  }
};

export default logger;