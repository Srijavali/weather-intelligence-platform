export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
  pressure: number;
  visibility: number;
  latitude: number;
  longitude: number;
  forecast: ForecastDay[];
}

export interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
}

export interface WeatherResponse {
  weather: WeatherData;
  source: "live" | "cache" | "stale";
}