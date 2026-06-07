import axios from "axios";

import env from "../config/env.js";

import AppError from "../utils/AppError.js";
import { retry } from "../utils/retry.js";
import { logger } from "../utils/logger.js";

import { ERROR_CODES } from "../constants/errorCodes.js";

class LocationService {
  async validateAndNormalizeLocation(
    locationInput,
    correlationId = "system"
  ) {
    const startTime = Date.now();

    try {
      if (
        !locationInput ||
        typeof locationInput !== "string"
      ) {
        throw new AppError(
          "Location is required",
          400,
          ERROR_CODES.INVALID_LOCATION
        );
      }

      const trimmedLocation =
        locationInput.trim();

      if (!trimmedLocation) {
        throw new AppError(
          "Location is required",
          400,
          ERROR_CODES.INVALID_LOCATION
        );
      }

      logger.info(
        "Location lookup started",
        {
          correlationId,
          locationInput: trimmedLocation
        }
      );

      const response = await retry(
        () =>
          axios.get(
            `${env.nominatim.baseUrl}/search`,
            {
              params: {
                q: trimmedLocation,
                format: "jsonv2",
                addressdetails: 1,
                limit: 1
              },

              timeout: 10000,

              headers: {
                "User-Agent":
                  "weather-intelligence-platform"
              }
            }
          ),
        {
          retries: 3,
          initialDelayMs: 500,
          correlationId
        }
      );

      const location =
        response.data?.[0];

      if (!location) {
        throw new AppError(
          "Location not found",
          404,
          ERROR_CODES.LOCATION_NOT_FOUND
        );
      }

      if (
        !location.display_name ||
        !location.lat ||
        !location.lon
      ) {
        throw new AppError(
          "Invalid location provider response",
          502,
          ERROR_CODES.INVALID_LOCATION_RESPONSE
        );
      }

      const latitude = Number(
        location.lat
      );

      const longitude = Number(
        location.lon
      );

      if (
        Number.isNaN(latitude) ||
        Number.isNaN(longitude)
      ) {
        throw new AppError(
          "Invalid coordinates returned from provider",
          502,
          ERROR_CODES.INVALID_LOCATION_RESPONSE
        );
      }

      const result = {
        locationInput: trimmedLocation,

        normalizedLocation:
          location.display_name,

        country:
          location.address?.country ??
          null,

        region:
          location.address?.state ??
          location.address?.county ??
          null,

        latitude,

        longitude
      };

      logger.info(
        "Location lookup successful",
        {
          correlationId,
          durationMs:
            Date.now() - startTime,
          normalizedLocation:
            result.normalizedLocation,
          latitude,
          longitude
        }
      );

      return result;
    } catch (error) {
      logger.error(
        "Location lookup failed",
        {
          correlationId,
          durationMs:
            Date.now() - startTime,
          locationInput,
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
          "Location service timeout",
          504,
          ERROR_CODES.LOCATION_SERVICE_TIMEOUT
        );
      }

      const status =
        error.response?.status;

      if (
        status === 429 ||
        status === 503
      ) {
        throw new AppError(
          "Location service unavailable",
          503,
          ERROR_CODES.LOCATION_SERVICE_UNAVAILABLE
        );
      }

      throw new AppError(
        "Location validation failed",
        500,
        ERROR_CODES.LOCATION_SERVICE_ERROR
      );
    }
  }
}

export default new LocationService();