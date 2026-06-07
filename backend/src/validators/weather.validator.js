import AppError from "../utils/AppError.js";

import { HTTP_STATUS } from "../constants/httpStatus.js";
import { ERROR_CODES } from "../constants/errorCodes.js";

const FORBIDDEN_WEATHER_FIELDS = [
  "temperature",
  "temperature_c",
  "feelsLike",
  "feels_like_c",
  "humidity",
  "windSpeed",
  "wind_kph",
  "pressure",
  "pressure_mb",
  "visibility",
  "visibility_km",
  "condition",
  "icon",
  "icon_url",
  "forecast",
  "latitude",
  "longitude",
  "country",
  "region",
  "normalized_location"
];

function isValidDate(dateString) {
  if (!dateString || typeof dateString !== "string") {
    return false;
  }

  const date = new Date(dateString);

  return !Number.isNaN(date.getTime());
}

function validateDateRange(startDate, endDate) {
  if (!isValidDate(startDate)) {
    throw new AppError(
      "Invalid startDate.",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_DATE_RANGE
    );
  }

  if (!isValidDate(endDate)) {
    throw new AppError(
      "Invalid endDate.",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_DATE_RANGE
    );
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    throw new AppError(
      "startDate cannot be after endDate.",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_DATE_RANGE
    );
  }
}

function validateForbiddenFields(payload) {
  const foundForbiddenFields = FORBIDDEN_WEATHER_FIELDS.filter(
    (field) => Object.prototype.hasOwnProperty.call(payload, field)
  );

  if (foundForbiddenFields.length > 0) {
    throw new AppError(
      `The following fields cannot be updated directly: ${foundForbiddenFields.join(
        ", "
      )}`,
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_REQUEST
    );
  }
}

export function validateCreateWeatherRecord(payload) {
  if (!payload || typeof payload !== "object") {
    throw new AppError(
      "Request body is required.",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR
    );
  }

  validateForbiddenFields(payload);

  const {
    location,
    startDate,
    endDate
  } = payload;

  if (!location || typeof location !== "string") {
    throw new AppError(
      "location is required.",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR
    );
  }

  if (!startDate) {
    throw new AppError(
      "startDate is required.",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR
    );
  }

  if (!endDate) {
    throw new AppError(
      "endDate is required.",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR
    );
  }

  validateDateRange(startDate, endDate);

  return {
    location: location.trim(),
    startDate,
    endDate
  };
}

export function validateUpdateWeatherRecord(payload) {
  if (!payload || typeof payload !== "object") {
    throw new AppError(
      "Request body is required.",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR
    );
  }

  validateForbiddenFields(payload);

  const {
    location,
    startDate,
    endDate
  } = payload;

  if (
    location === undefined &&
    startDate === undefined &&
    endDate === undefined
  ) {
    throw new AppError(
      "At least one updatable field must be provided.",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR
    );
  }

  if (
    location !== undefined &&
    (typeof location !== "string" || !location.trim())
  ) {
    throw new AppError(
      "location must be a non-empty string.",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR
    );
  }

  if (
    startDate !== undefined &&
    !isValidDate(startDate)
  ) {
    throw new AppError(
      "Invalid startDate.",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_DATE_RANGE
    );
  }

  if (
    endDate !== undefined &&
    !isValidDate(endDate)
  ) {
    throw new AppError(
      "Invalid endDate.",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_DATE_RANGE
    );
  }

  /*
   * If both dates are provided,
   * validate immediately.
   *
   * If only one date is provided,
   * service layer will validate after
   * merging with existing record.
   */
  if (
    startDate !== undefined &&
    endDate !== undefined
  ) {
    validateDateRange(startDate, endDate);
  }

  const sanitizedPayload = {};

  if (location !== undefined) {
    sanitizedPayload.location = location.trim();
  }

  if (startDate !== undefined) {
    sanitizedPayload.startDate = startDate;
  }

  if (endDate !== undefined) {
    sanitizedPayload.endDate = endDate;
  }

  return sanitizedPayload;
}