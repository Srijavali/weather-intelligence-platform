import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import RecordForm from "../components/RecordForm";

import {
  getRecordById,
  updateRecord,
} from "../services/weatherRecordService";

import type {
  CreateWeatherRecordRequest,
} from "../types/weatherRecord";

import { AppError } from "../utils/AppError";

export default function EditRecord() {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [
    initialValues,
    setInitialValues,
  ] =
    useState<CreateWeatherRecordRequest | null>(
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

          const record =
            await getRecordById(
              id
            );

          setInitialValues({
            location:
              record.location_input,
            startDate:
              record.start_date,
            endDate:
              record.end_date,
          });

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

  const handleSubmit = async (
    values: CreateWeatherRecordRequest
  ) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!id) {
        throw new AppError(
          "Record id is required.",
          "VALIDATION_ERROR"
        );
      }

      await updateRecord(
        id,
        values
      );

      setSuccess(
        "Weather record updated successfully."
      );

      setTimeout(() => {
        navigate(
          `/records/${id}`
        );
      }, 1500);

    } catch (error) {

      console.error(error);

      if (
        error instanceof AppError
      ) {
        switch (
          error.code
        ) {
          case "VALIDATION_ERROR":
            setError(
              "Please verify the entered values."
            );
            break;

          case "INVALID_LOCATION":
            setError(
              "Location validation failed."
            );
            break;

          case "INVALID_DATE_RANGE":
            setError(
              "Start date must not be after end date."
            );
            break;

          case "RECORD_NOT_FOUND":
            setError(
              "Weather record not found."
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
                "Failed to update record."
            );
        }
      } else {
        setError(
          "Unexpected error occurred."
        );
      }

    } finally {

      setSaving(false);

    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-white">
        Loading record...
      </div>
    );
  }

  if (error && !initialValues) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
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

  if (!initialValues) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-white">
        Record not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-white">
          Edit Weather Record
        </h1>

        <p className="mt-2 text-slate-400">
          Update location and date
          range information.
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
        initialValues={
          initialValues
        }
        loading={saving}
        submitButtonText="Update Record"
        onSubmit={
          handleSubmit
        }
      />

    </div>
  );
}