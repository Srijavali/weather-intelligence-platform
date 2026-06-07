import type {
  ApiSuccessResponse,
  CreateWeatherRecordRequest,
  UpdateWeatherRecordRequest,
  WeatherRecord,
  WeatherRecordsResponse,
} from "../types/weatherRecord";

import { AppError } from "../utils/AppError";
import { fetchWithTimeout } from "../utils/timeout";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const REQUEST_TIMEOUT = 10000;

function buildHeaders() {
  return {
    "Content-Type": "application/json",
  };
}

async function parseResponse(
  response: Response
) {
  try {
    return await response.json();
  } catch {
    throw new AppError(
      "Invalid server response",
      "INVALID_RESPONSE"
    );
  }
}

function handleBackendError(
  response: Response,
  responseBody: any
): never {
  const backendCode =
    responseBody?.error?.code;

  const backendMessage =
    responseBody?.error?.message;

  switch (backendCode) {
    case "VALIDATION_ERROR":
      throw new AppError(
        backendMessage ||
          "Validation error",
        "VALIDATION_ERROR",
        response.status
      );

    case "INVALID_DATE_RANGE":
      throw new AppError(
        backendMessage ||
          "Invalid date range",
        "INVALID_DATE_RANGE",
        response.status
      );

    case "INVALID_LOCATION":
      throw new AppError(
        backendMessage ||
          "Location not found",
        "INVALID_LOCATION",
        response.status
      );

    case "RECORD_NOT_FOUND":
      throw new AppError(
        backendMessage ||
          "Record not found",
        "RECORD_NOT_FOUND",
        response.status
      );

    default:
      throw new AppError(
        backendMessage ||
          "Request failed",
        backendCode ||
          "REQUEST_FAILED",
        response.status
      );
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    if (!API_BASE_URL) {
      throw new AppError(
        "Backend API URL missing",
        "CONFIG_ERROR"
      );
    }

    const response =
    await fetchWithTimeout(
        `${API_BASE_URL}${endpoint}`,
        {
        ...options,
        headers: {
            ...buildHeaders(),
            ...(options.headers || {}),
        },
        },
        REQUEST_TIMEOUT
    );
    const responseBody =
      await parseResponse(response);

    if (!response.ok) {
      handleBackendError(
        response,
        responseBody
      );
    }

    return responseBody;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error) {
      if (
        error.name === "TimeoutError" ||
        error.message
          .toLowerCase()
          .includes("timeout")
      ) {
        throw new AppError(
          "Request timed out",
          "REQUEST_TIMEOUT",
          408
        );
      }
    }

    throw new AppError(
      "Network error occurred",
      "NETWORK_ERROR"
    );
  }
}

export async function getRecords(
  page = 1,
  limit = 10,
  location?: string,
  startDate?: string,
  endDate?: string
): Promise<WeatherRecordsResponse> {
  const params =
    new URLSearchParams();

  params.set(
    "page",
    String(page)
  );

  params.set(
    "limit",
    String(limit)
  );

  if (location) {
    params.set(
      "location",
      location
    );
  }

  if (startDate) {
    params.set(
      "startDate",
      startDate
    );
  }

  if (endDate) {
    params.set(
      "endDate",
      endDate
    );
  }

  const response =
    await request<
      ApiSuccessResponse<WeatherRecordsResponse>
    >(
      `/weather-records?${params.toString()}`
    );

  return response.data;
}

export async function getRecordById(
  id: string
): Promise<WeatherRecord> {
  const response =
    await request<
      ApiSuccessResponse<WeatherRecord>
    >(`/weather-records/${id}`);

  return response.data;
}

export async function createRecord(
  payload: CreateWeatherRecordRequest
): Promise<{ id: string }> {
  const response =
    await request<
      ApiSuccessResponse<{
        id: string;
      }>
    >("/weather-records", {
      method: "POST",
      body: JSON.stringify(payload),
    });

  return response.data;
}

export async function updateRecord(
  id: string,
  payload: UpdateWeatherRecordRequest
): Promise<WeatherRecord> {
  const response =
    await request<
      ApiSuccessResponse<WeatherRecord>
    >(`/weather-records/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

  return response.data;
}

export async function deleteRecord(
  id: string
): Promise<{
  deleted: boolean;
  id: number;
}> {
  const response =
    await request<
      ApiSuccessResponse<{
        deleted: boolean;
        id: number;
      }>
    >(`/weather-records/${id}`, {
      method: "DELETE",
    });

  return response.data;
}

export async function exportJson() {
  if (!API_BASE_URL) {
    throw new AppError(
      "Backend API URL missing",
      "CONFIG_ERROR"
    );
  }

  window.open(
    `${API_BASE_URL}/exports/json`,
    "_blank"
  );
}

export async function exportCsv() {
  if (!API_BASE_URL) {
    throw new AppError(
      "Backend API URL missing",
      "CONFIG_ERROR"
    );
  }

  window.open(
    `${API_BASE_URL}/exports/csv`,
    "_blank"
  );
}