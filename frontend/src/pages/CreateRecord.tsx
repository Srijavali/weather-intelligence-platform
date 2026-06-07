import { useState } from "react";
import { useNavigate } from "react-router-dom";

import RecordForm from "../components/RecordForm";

import { createRecord } from "../services/weatherRecordService";

import type {
  CreateWeatherRecordRequest,
} from "../types/weatherRecord";

import { AppError } from "../utils/AppError";

export default function CreateRecord() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleSubmit = async (
    values: CreateWeatherRecordRequest
  ) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const result =
        await createRecord(values);

      setSuccess(
        `Weather record #${result.id} created successfully.`
      );

      setTimeout(() => {
        navigate("/records");
      }, 1500);

    } catch (error) {

      console.error(error);

      if (error instanceof AppError) {

        switch (error.code) {

          case "VALIDATION_ERROR":
            setError(
              "Please verify the entered values."
            );
            break;

          case "INVALID_DATE_RANGE":
            setError(
              "Start date must not be after end date."
            );
            break;

          case "INVALID_LOCATION":
            setError(
              "Location could not be validated."
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

          default:
            setError(
              error.message ||
                "Failed to create weather record."
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-white">
          Create Weather Record
        </h1>

        <p className="mt-2 text-slate-400">
          Create a new weather record using
          a location and date range.
        </p>

      </div>

      {error && (
        <div
          className="
            mb-6
            rounded-lg
            border
            border-red-500
            bg-red-500/10
            px-4
            py-3
            text-red-300
          "
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="
            mb-6
            rounded-lg
            border
            border-green-500
            bg-green-500/10
            px-4
            py-3
            text-green-300
          "
        >
          {success}
        </div>
      )}

      <RecordForm
        loading={loading}
        submitButtonText="Create Record"
        onSubmit={handleSubmit}
      />

    </div>
  );
}