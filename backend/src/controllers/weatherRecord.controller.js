import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

import { successResponse } from "../utils/apiResponse.js";

import { HTTP_STATUS } from "../constants/httpStatus.js";
import { ERROR_CODES } from "../constants/errorCodes.js";

import weatherRecordService from "../services/weatherRecord.service.js";

import {
  validateCreateWeatherRecord,
  validateUpdateWeatherRecord
} from "../validators/weather.validator.js";

class WeatherRecordController {
  create = asyncHandler(async (req, res) => {
    const correlationId = req.correlationId;

    const payload =
      validateCreateWeatherRecord(req.body);

    const record =
      await weatherRecordService.create(
        payload,
        correlationId
      );

    return res.status(HTTP_STATUS.CREATED).json(
      successResponse({
        message: "Weather record created successfully.",
        correlationId,
        data: record
      })
    );
  });

  getAll = asyncHandler(async (req, res) => {
    const correlationId = req.correlationId;

    const filters = {
    page:
        req.query.page,

    limit:
        req.query.limit,

    location:
        typeof req.query.location === "string"
        ? req.query.location.trim()
        : undefined,

    startDate:
        typeof req.query.startDate === "string"
        ? req.query.startDate
        : undefined,

    endDate:
        typeof req.query.endDate === "string"
        ? req.query.endDate
        : undefined
    };

    const records =
      await weatherRecordService.getAll(
        filters,
        correlationId
      );

    return res.status(HTTP_STATUS.OK).json(
      successResponse({
        message: "Weather records retrieved successfully.",
        correlationId,
        data: records
      })
    );
  });

  getById = asyncHandler(async (req, res) => {
    const correlationId = req.correlationId;

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(
        "Invalid record id.",
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    const record =
      await weatherRecordService.getById(
        id,
        correlationId
      );

    return res.status(HTTP_STATUS.OK).json(
      successResponse({
        message: "Weather record retrieved successfully.",
        correlationId,
        data: record
      })
    );
  });

  update = asyncHandler(async (req, res) => {
    const correlationId = req.correlationId;

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(
        "Invalid record id.",
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    const payload =
      validateUpdateWeatherRecord(req.body);

    const updatedRecord =
      await weatherRecordService.update(
        id,
        payload,
        correlationId
      );

    return res.status(HTTP_STATUS.OK).json(
      successResponse({
        message: "Weather record updated successfully.",
        correlationId,
        data: updatedRecord
      })
    );
  });

  delete = asyncHandler(async (req, res) => {
    const correlationId = req.correlationId;

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(
        "Invalid record id.",
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    const result =
      await weatherRecordService.delete(
        id,
        correlationId
      );

    return res.status(HTTP_STATUS.OK).json(
      successResponse({
        message: "Weather record deleted successfully.",
        correlationId,
        data: result
      })
    );
  });
}

export default new WeatherRecordController();