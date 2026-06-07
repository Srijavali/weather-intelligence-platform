import type { WeatherData } from "../types/weather";
import { WeatherSchema } from "../schemas/weatherSchema";
import { fetchWithTimeout } from "../utils/timeout";
import { AppError } from "../utils/AppError";
import { createNewRequest } from "../utils/requestManager";
import {
  getCachedWeather,
  getStaleWeather,
  saveWeatherCache,
} from "../utils/weatherCache";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export interface WeatherResult {
  weather: WeatherData;
  source: "live" | "cache" | "stale";
}

export const getWeather = async (
  location: string
): Promise<WeatherResult> => {
  try {
    if (!API_BASE_URL) {
      throw new AppError(
        "Backend API URL missing",
        "CONFIG_ERROR"
      );
    }

    const cached =
      getCachedWeather<WeatherData>(location);

    if (cached) {
      return {
        weather: cached,
        source: "cache",
      };
    }

    const signal = createNewRequest();

    const url =
      `${API_BASE_URL}/weather?location=` +
      encodeURIComponent(location);

    const response =
      await fetchWithTimeout(
        url,
        {},
        10000,
        signal
      );

    let responseBody: any = null;

    try {
      responseBody = await response.json();
    } catch {
      throw new AppError(
        "Invalid server response",
        "INVALID_RESPONSE"
      );
    }

    if (!response.ok) {
      const backendCode =
        responseBody?.error?.code;

      const backendMessage =
        responseBody?.error?.message;

      switch (backendCode) {
        case "INVALID_LOCATION":
          throw new AppError(
            backendMessage ||
              "Location not found",
            "INVALID_LOCATION",
            400
          );

        case "VALIDATION_ERROR":
          throw new AppError(
            backendMessage ||
              "Validation error",
            "VALIDATION_ERROR",
            400
          );

        case "WEATHER_SERVICE_TIMEOUT":
          throw new AppError(
            backendMessage ||
              "Weather service timeout",
            "REQUEST_TIMEOUT",
            408
          );

        case "WEATHER_SERVICE_UNAVAILABLE":
          throw new AppError(
            backendMessage ||
              "Weather service unavailable",
            "SERVICE_UNAVAILABLE",
            503
          );

        default:
          throw new AppError(
            backendMessage ||
              "Failed to fetch weather data",
            backendCode ||
              "FETCH_FAILED",
            response.status
          );
      }
    }

    const parsed =
      WeatherSchema.safeParse(responseBody);

    if (!parsed.success) {
      throw new AppError(
        "Backend returned unexpected data structure",
        "INVALID_RESPONSE"
      );
    }

    const weather =
      parsed.data.data;

    saveWeatherCache(
      location,
      weather
    );

    return {
      weather,
      source: "live",
    };
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      throw new AppError(
        "Previous request cancelled",
        "REQUEST_CANCELLED"
      );
    }

    if (error instanceof AppError) {
      const recoverableErrors = [
        "NETWORK_ERROR",
        "REQUEST_TIMEOUT",
        "SERVICE_UNAVAILABLE",
      ];

      if (
        recoverableErrors.includes(
          error.code
        )
      ) {
        const stale =
          getStaleWeather<WeatherData>(
            location
          );

        if (stale) {
          return {
            weather: stale,
            source: "stale",
          };
        }
      }

      throw error;
    }

    if (error instanceof Error) {
      if (
        error.name === "TimeoutError" ||
        error.message
          .toLowerCase()
          .includes("timeout")
      ) {
        const stale =
          getStaleWeather<WeatherData>(
            location
          );

        if (stale) {
          return {
            weather: stale,
            source: "stale",
          };
        }

        throw new AppError(
          "Request timed out",
          "REQUEST_TIMEOUT",
          408
        );
      }
    }

    const stale =
      getStaleWeather<WeatherData>(
        location
      );

    if (stale) {
      return {
        weather: stale,
        source: "stale",
      };
    }

    throw new AppError(
      "Network error occurred",
      "NETWORK_ERROR"
    );
  }
};