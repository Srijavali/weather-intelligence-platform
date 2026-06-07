export interface WeatherRecord {
  id: string;

  location_input: string;
  normalized_location: string;

  country: string;
  region: string;

  latitude: string;
  longitude: string;

  start_date: string;
  end_date: string;

  temperature_c: string;
  feels_like_c: string;

  humidity: number;

  wind_kph: string;
  pressure_mb: string;
  visibility_km: string;

  condition: string;
  icon_url: string;

  created_at: string;
  updated_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export interface WeatherRecordsResponse {
  records: WeatherRecord[];
  pagination: Pagination;
}

export interface CreateWeatherRecordRequest {
  location: string;
  startDate: string;
  endDate: string;
}

export interface UpdateWeatherRecordRequest {
  location?: string;
  startDate?: string;
  endDate?: string;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  correlationId?: string;
  data: T;
}