import AppError from "../utils/AppError.js";

import weatherService from "../services/weather.service.js";

import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";

import { HTTP_STATUS } from "../constants/httpStatus.js";
import { ERROR_CODES } from "../constants/errorCodes.js";

class WeatherController {
  getCurrentWeather = asyncHandler(async (req, res) => {
    const correlationId = req.correlationId;

    const location =
      typeof req.query.location === "string"
        ? req.query.location.trim()
        : "";

    if (!location) {
      throw new AppError(
        "location query parameter is required.",
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    const weatherData = await weatherService.getWeather({
      location,
      correlationId
    });

    return res.status(HTTP_STATUS.OK).json(
      successResponse({
        message: "Weather retrieved successfully.",
        correlationId,
        data: weatherData
      })
    );
  });
}

export default new WeatherController();