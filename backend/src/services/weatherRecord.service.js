import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";

import { HTTP_STATUS } from "../constants/httpStatus.js";
import { ERROR_CODES } from "../constants/errorCodes.js";

import weatherRecordRepository from "../repositories/weatherRecord.repository.js";

import locationService from "./location.service.js";
import weatherService from "./weather.service.js";

class WeatherRecordService {
  validateDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      throw new AppError(
        "Invalid date range.",
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.INVALID_DATE_RANGE
      );
    }

    if (start > end) {
      throw new AppError(
        "Start date cannot be after end date.",
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.INVALID_DATE_RANGE
      );
    }
  }

  async create(data, correlationId) {
    const {
      location,
      startDate,
      endDate
    } = data;

    this.validateDateRange(
      startDate,
      endDate
    );

    logger.info({
      correlationId,
      operation: "weather_record_create_started",
      location
    });

    const normalizedLocation =
      await locationService.validateAndNormalizeLocation(
        location,
        correlationId
      );

    const weather =
      await weatherService.getWeather({
        location,
        correlationId
      });

    const record =
      await weatherRecordRepository.create({
        locationInput:
          normalizedLocation.locationInput,

        normalizedLocation:
          normalizedLocation.normalizedLocation,

        country:
          normalizedLocation.country,

        region:
          normalizedLocation.region,

        latitude:
          normalizedLocation.latitude,

        longitude:
          normalizedLocation.longitude,

        startDate,
        endDate,

        temperatureC:
          weather.temperature,

        feelsLikeC:
          weather.feelsLike,

        humidity:
          weather.humidity,

        windKph:
          weather.windSpeed,

        pressureMb:
          weather.pressure,

        visibilityKm:
          weather.visibility,

        condition:
          weather.condition,

        iconUrl:
          weather.icon
      });

    logger.info({
      correlationId,
      operation: "weather_record_created",
      recordId: record.id
    });

    return record;
  }

  async getById(id, correlationId) {
    const record =
      await weatherRecordRepository.findById(id);

    if (!record) {
      throw new AppError(
        "Weather record not found.",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RECORD_NOT_FOUND
      );
    }

    logger.info({
      correlationId,
      operation: "weather_record_retrieved",
      recordId: id
    });

    return record;
  }

  async getAll(filters = {}, correlationId) {
    const page =
        Number(filters.page) || 1;

    const limit = Math.min(
        Number(filters.limit) || 10,
        100
        );

    const {
        records,
        totalRecords
    } =
        await weatherRecordRepository.findAll({
        ...filters,
        page,
        limit
        });

    logger.info({
        correlationId,
        operation: "weather_records_retrieved",
        count: records.length,
        page,
        limit
    });

    return {
        records,
        pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(
            totalRecords / limit
        )
        }
    };
    }

  async update(id, data, correlationId) {
    const existing =
      await weatherRecordRepository.findById(id);

    if (!existing) {
      throw new AppError(
        "Weather record not found.",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RECORD_NOT_FOUND
      );
    }

    const updatedLocation =
      data.location ??
      existing.location_input;

    const updatedStartDate =
      data.startDate ??
      existing.start_date;

    const updatedEndDate =
      data.endDate ??
      existing.end_date;

    this.validateDateRange(
      updatedStartDate,
      updatedEndDate
    );

    let updatePayload = {
      locationInput:
        existing.location_input,

      normalizedLocation:
        existing.normalized_location,

      country:
        existing.country,

      region:
        existing.region,

      latitude:
        existing.latitude,

      longitude:
        existing.longitude,

      startDate:
        updatedStartDate,

      endDate:
        updatedEndDate,

      temperatureC:
        existing.temperature_c,

      feelsLikeC:
        existing.feels_like_c,

      humidity:
        existing.humidity,

      windKph:
        existing.wind_kph,

      pressureMb:
        existing.pressure_mb,

      visibilityKm:
        existing.visibility_km,

      condition:
        existing.condition,

      iconUrl:
        existing.icon_url
    };

    const locationChanged =
      updatedLocation.trim().toLowerCase() !==
      existing.location_input.trim().toLowerCase();

    if (locationChanged) {
      const normalizedLocation =
        await locationService.validateAndNormalizeLocation(
          updatedLocation,
          correlationId
        );

      const weather =
        await weatherService.getWeather({
          location: updatedLocation,
          correlationId
        });

      updatePayload = {
        ...updatePayload,

        locationInput:
          normalizedLocation.locationInput,

        normalizedLocation:
          normalizedLocation.normalizedLocation,

        country:
          normalizedLocation.country,

        region:
          normalizedLocation.region,

        latitude:
          normalizedLocation.latitude,

        longitude:
          normalizedLocation.longitude,

        temperatureC:
          weather.temperature,

        feelsLikeC:
          weather.feelsLike,

        humidity:
          weather.humidity,

        windKph:
          weather.windSpeed,

        pressureMb:
          weather.pressure,

        visibilityKm:
          weather.visibility,

        condition:
          weather.condition,

        iconUrl:
          weather.icon
      };
    }

    const updatedRecord =
      await weatherRecordRepository.update(
        id,
        updatePayload
      );

    logger.info({
      correlationId,
      operation: "weather_record_updated",
      recordId: id,
      locationChanged
    });

    return updatedRecord;
  }

  async delete(id, correlationId) {
    const existing =
      await weatherRecordRepository.findById(id);

    if (!existing) {
      throw new AppError(
        "Weather record not found.",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RECORD_NOT_FOUND
      );
    }

    await weatherRecordRepository.delete(id);

    logger.info({
      correlationId,
      operation: "weather_record_deleted",
      recordId: id
    });

    return {
      deleted: true,
      id
    };
  }
}

export default new WeatherRecordService();