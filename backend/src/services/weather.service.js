import axios from "axios";

import env from "../config/env.js";

import AppError from "../utils/AppError.js";
import { retry } from "../utils/retry.js";
import logger from "../utils/logger.js";

import { ERROR_CODES } from "../constants/errorCodes.js";

class WeatherService {
  async getWeather({
    location,
    correlationId = "system"
  }) {
    const startTime = Date.now();

    try {
      logger.info(
        "Weather lookup started",
        {
          correlationId,
          location,
        }
      );

      const response = await retry(
        () =>
          axios.get(
            `${env.weather.baseUrl}/forecast.json`,
            {
              params: {
                key: env.weather.apiKey,
                q: location,
                days: 5
              },

              timeout: 10000
            }
          ),
        {
          retries: 3,
          initialDelayMs: 500,
          correlationId
        }
      );

      const data = response.data;

      if (
        !data ||
        !data.location ||
        !data.current
      ) {
        throw new AppError(
          "Invalid weather provider response",
          502,
          ERROR_CODES.INVALID_WEATHER_RESPONSE
        );
      }

      const weather = {
        city: data.location.name,

        country:
          data.location.country,

        region:
          data.location.region,

        latitude:
          data.location.lat,

        longitude:
          data.location.lon,

        temperature:
          data.current.temp_c,

        feelsLike:
          data.current.feelslike_c,

        humidity:
          data.current.humidity,

        windSpeed:
          data.current.wind_kph,

        pressure:
          data.current.pressure_mb,

        visibility:
          data.current.vis_km,

        condition:
          data.current.condition.text,

        icon:
          data.current.condition.icon,

        forecast:
          data.forecast?.forecastday?.map(
            (day) => ({
              date: day.date,
              maxTemp:
                day.day.maxtemp_c,
              minTemp:
                day.day.mintemp_c,
              condition:
                day.day.condition.text,
              icon:
                day.day.condition.icon
            })
          ) || []
      };

      logger.info(
        "Weather lookup successful",
        {
          correlationId,
          durationMs:
            Date.now() - startTime,
          location
        }
      );

      return weather;
    } catch (error) {
      logger.error(
        "Weather lookup failed",
        {
          correlationId,
          durationMs:
            Date.now() - startTime,
          error: error.message
        }
      );

      if (error instanceof AppError) {
        throw error;
      }

      if (
        error.code === "ECONNABORTED"
      ) {
        throw new AppError(
          "Weather service timeout",
          504,
          ERROR_CODES.WEATHER_SERVICE_TIMEOUT
        );
      }

      const status =
        error.response?.status;

      if (status === 400) {
        throw new AppError(
          "Invalid location",
          400,
          ERROR_CODES.INVALID_LOCATION
        );
      }

      if (status === 401) {
        throw new AppError(
          "Invalid weather API key",
          500,
          ERROR_CODES.WEATHER_API_KEY_INVALID
        );
      }

      if (
        status === 429 ||
        status >= 500
      ) {
        throw new AppError(
          "Weather service unavailable",
          503,
          ERROR_CODES.WEATHER_SERVICE_UNAVAILABLE
        );
      }

      throw new AppError(
        "Weather lookup failed",
        500,
        ERROR_CODES.WEATHER_SERVICE_ERROR
      );
    }
  }
}

export default new WeatherService();