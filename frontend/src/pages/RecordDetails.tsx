import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getRecordById,
} from "../services/weatherRecordService";

import type {
  WeatherRecord,
} from "../types/weatherRecord";

import { AppError } from "../utils/AppError";

function formatDate(
  value: string
) {
  return new Date(
    value
  ).toLocaleString();
}

export default function RecordDetails() {
  const { id } =
    useParams();

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [record, setRecord] =
    useState<WeatherRecord | null>(
      null
    );

  useEffect(() => {
    const loadRecord =
      async () => {
        try {
          setLoading(true);
          setError("");

          if (!id) {
            throw new AppError(
              "Record id is required.",
              "VALIDATION_ERROR"
            );
          }

          const result =
            await getRecordById(
              id
            );

          setRecord(result);

        } catch (error) {

          console.error(error);

          if (
            error instanceof AppError
          ) {
            setError(
              error.message
            );
          } else {
            setError(
              "Failed to load record."
            );
          }

        } finally {

          setLoading(false);

        }
      };

    loadRecord();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-white">
        Loading record...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div
          className="
            rounded-lg
            border
            border-red-500
            bg-red-500/10
            p-4
            text-red-300
          "
        >
          {error}
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-white">
        Record not found.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
          mb-8
        "
      >
        <div>
          <h1 className="text-3xl font-bold text-white">
            Weather Record
          </h1>

          <p className="text-slate-400 mt-2">
            Detailed weather record
            information.
          </p>
        </div>

        <div className="flex gap-3">

          <Link
            to="/records"
            className="
              rounded-lg
              bg-slate-700
              px-4
              py-2
              text-white
            "
          >
            Back
          </Link>

          <Link
            to={`/records/${record.id}/edit`}
            className="
              rounded-lg
              bg-amber-500
              px-4
              py-2
              text-white
            "
          >
            Edit
          </Link>

        </div>
      </div>

      <div
        className="
          rounded-xl
          bg-slate-800
          p-6
          shadow-lg
        "
      >
        <div
          className="
            flex
            items-center
            gap-4
            mb-8
          "
        >
          <img
            src={
              record.icon_url.startsWith(
                "//"
              )
                ? `https:${record.icon_url}`
                : record.icon_url
            }
            alt={
              record.condition
            }
            className="h-16 w-16"
          />

          <div>
            <h2 className="text-2xl font-bold text-white">
              {
                record.location_input
              }
            </h2>

            <p className="text-slate-400">
              {
                record.condition
              }
            </p>
          </div>
        </div>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          "
        >

          <InfoCard
            label="Normalized Location"
            value={
              record.normalized_location
            }
          />

          <InfoCard
            label="Country"
            value={
              record.country
            }
          />

          <InfoCard
            label="Region"
            value={
              record.region
            }
          />

          <InfoCard
            label="Latitude"
            value={
              record.latitude
            }
          />

          <InfoCard
            label="Longitude"
            value={
              record.longitude
            }
          />

          <InfoCard
            label="Temperature"
            value={`${record.temperature_c} °C`}
          />

          <InfoCard
            label="Feels Like"
            value={`${record.feels_like_c} °C`}
          />

          <InfoCard
            label="Humidity"
            value={`${record.humidity}%`}
          />

          <InfoCard
            label="Wind Speed"
            value={`${record.wind_kph} km/h`}
          />

          <InfoCard
            label="Pressure"
            value={`${record.pressure_mb} mb`}
          />

          <InfoCard
            label="Visibility"
            value={`${record.visibility_km} km`}
          />

          <InfoCard
            label="Start Date"
            value={formatDate(
              record.start_date
            )}
          />

          <InfoCard
            label="End Date"
            value={formatDate(
              record.end_date
            )}
          />

          <InfoCard
            label="Created At"
            value={formatDate(
              record.created_at
            )}
          />

          <InfoCard
            label="Updated At"
            value={formatDate(
              record.updated_at
            )}
          />

        </div>
      </div>

    </div>
  );
}

interface InfoCardProps {
  label: string;
  value: string;
}

function InfoCard({
  label,
  value,
}: InfoCardProps) {
  return (
    <div
      className="
        rounded-lg
        bg-slate-900
        p-4
      "
    >
      <p className="text-slate-400 text-sm">
        {label}
      </p>

      <p className="text-white mt-1 break-words">
        {value}
      </p>
    </div>
  );
}