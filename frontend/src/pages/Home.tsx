import { useEffect, useRef, useState } from "react";

import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import ForecastCard from "../components/ForecastCard";
import LocationButton from "../components/LocationButton";
import ErrorMessage from "../components/ErrorMessage";
import OfflineBanner from "../components/OfflineBanner";
import StaleDataBanner from "../components/StaleDataBanner";

import {
  cleanupExpiredCache,
} from "../utils/weatherCache";

import { useNetworkStatus } from "../hooks/useNetworkStatus";

import type { WeatherData } from "../types/weather";
import { getWeather } from "../services/weatherService";
import { AppError } from "../utils/AppError";

function Home() {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [weather, setWeather] =
    useState<WeatherData | null>(null);

  const [
    showStaleBanner,
    setShowStaleBanner,
  ] = useState(false);

  const lastSearchRef = useRef("");

  const isOnline = useNetworkStatus();

  useEffect(() => {
    cleanupExpiredCache();

    if (isOnline) {
      setError("");
      setShowStaleBanner(false);
    }
  }, [isOnline]);

  const handleSearch = async (
    location: string
  ) => {
    if (!isOnline) {
      setError(
        "No internet connection."
      );
      return;
    }

    const normalized =
      location.trim().toLowerCase();

    if (!normalized) {
      return;
    }

    if (loading) {
      return;
    }

    if (
      normalized ===
      lastSearchRef.current
    ) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result =
        await getWeather(location);

      setWeather(
        result.weather
      );

      setShowStaleBanner(
        result.source === "stale"
      );

      // Only remember successful searches
      lastSearchRef.current =
        normalized;

    } catch (error: unknown) {

      console.error(error);

      setWeather(null);
      setShowStaleBanner(false);

      if (error instanceof AppError) {

        switch (error.code) {

          case "INVALID_LOCATION":
            setError(
              "Location not found. Try another city or coordinates."
            );
            break;

          case "VALIDATION_ERROR":
            setError(
              "Please enter a valid location."
            );
            break;

          case "CONFIG_ERROR":
            setError(
              "Application configuration error."
            );
            break;

          case "RATE_LIMIT":
            setError(
              "Too many requests. Please wait and try again."
            );
            break;

          case "REQUEST_TIMEOUT":
            setError(
              "Request timed out. Please try again."
            );
            break;

          case "NETWORK_ERROR":
            setError(
              "Network connection unavailable."
            );
            break;

          case "SERVICE_UNAVAILABLE":
            setError(
              "Weather service is temporarily unavailable."
            );
            break;

          case "REQUEST_CANCELLED":
            return;

          default:
            setError(
              "Unexpected error occurred."
            );
        }

      } else {

        setError(
          "Unexpected error occurred."
        );

      }

    } finally {

      setLoading(false);

    }
  };

  const handleCurrentLocation = () => {

    if (!isOnline) {
      setError(
        "No internet connection."
      );
      return;
    }

    if (loading) {
      return;
    }

    if (!navigator.geolocation) {

      setError(
        "Geolocation is not supported by your browser."
      );

      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        try {

          const lat =
            position.coords.latitude;

          const lon =
            position.coords.longitude;

          const result =
            await getWeather(
              `${lat},${lon}`
            );

          setWeather(
            result.weather
          );

          setShowStaleBanner(
            result.source ===
              "stale"
          );

        } catch (error) {

          console.error(error);

          setWeather(null);
          setShowStaleBanner(false);

          setError(
            "Unable to fetch weather for current location."
          );

        } finally {

          setLoading(false);

        }

      },

      (error) => {

        console.error(error);

        setWeather(null);
        setShowStaleBanner(false);

        setLoading(false);

        switch (error.code) {

          case error.PERMISSION_DENIED:
            setError(
              "Location permission denied."
            );
            break;

          case error.POSITION_UNAVAILABLE:
            setError(
              "Location information unavailable."
            );
            break;

          case error.TIMEOUT:
            setError(
              "Location request timed out."
            );
            break;

          default:
            setError(
              "Unable to determine location."
            );
        }

      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }

    );
  };

  return (
    <>
      <OfflineBanner
        visible={!isOnline}
      />

      <StaleDataBanner
        visible={
          showStaleBanner
        }
      />

      <div className="min-h-screen bg-slate-900 text-white">

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 md:pt-16">

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
            🌤 Weather Intelligence
          </h1>

          <p className="text-center text-slate-400 mt-4">
            Get real-time weather forecasts and insights.
          </p>

          <div className="mt-12">
            <SearchBar
              onSearch={
                handleSearch
              }
              loading={loading}
            />
          </div>

          {error && (
            <div className="mt-4">
              <ErrorMessage
                message={error}
              />
            </div>
          )}

          <div className="mt-4 flex justify-center">
            <LocationButton
              onClick={
                handleCurrentLocation
              }
            />
          </div>

          {weather && (
            <>
              <WeatherCard
                weather={weather}
              />

              {weather.forecast
                ?.length > 0 && (
                <div className="mt-8">

                  <h2 className="text-lg sm:text-xl font-semibold mb-4">
                    5-Day Forecast
                  </h2>

                  <div
                    className="
                      grid
                      grid-cols-2
                      md:grid-cols-5
                      gap-4
                    "
                  >
                    {weather.forecast.map(
                      (day) => (
                        <ForecastCard
                          key={
                            day.date
                          }
                          forecast={
                            day
                          }
                        />
                      )
                    )}
                  </div>

                </div>
              )}
            </>
          )}

        </div>

      </div>
    </>
  );
}

export default Home;