import { useState } from "react";

import type {
  CreateWeatherRecordRequest,
} from "../types/weatherRecord";

interface RecordFormProps {
  initialValues?: CreateWeatherRecordRequest;

  loading?: boolean;

  submitButtonText?: string;

  onSubmit: (
    values: CreateWeatherRecordRequest
  ) => Promise<void>;
}

function formatDateForInput(
  date?: string
) {
  if (!date) {
    return "";
  }

  return date.split("T")[0];
}

export default function RecordForm({
  initialValues,
  loading = false,
  submitButtonText = "Save Record",
  onSubmit,
}: RecordFormProps) {
  const [location, setLocation] =
    useState(
      initialValues?.location ?? ""
    );

  const [startDate, setStartDate] =
    useState(
      formatDateForInput(
        initialValues?.startDate
      )
    );

  const [endDate, setEndDate] =
    useState(
      formatDateForInput(
        initialValues?.endDate
      )
    );

  const [validationError, setValidationError] =
    useState("");

  const validateForm = () => {
    if (!location.trim()) {
      setValidationError(
        "Location is required."
      );
      return false;
    }

    if (!startDate) {
      setValidationError(
        "Start date is required."
      );
      return false;
    }

    if (!endDate) {
      setValidationError(
        "End date is required."
      );
      return false;
    }

    const start =
      new Date(startDate);

    const end =
      new Date(endDate);

    if (start > end) {
      setValidationError(
        "Start date cannot be after end date."
      );
      return false;
    }

    setValidationError("");

    return true;
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    await onSubmit({
      location:
        location.trim(),
      startDate,
      endDate,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-slate-800
        rounded-xl
        shadow-lg
        p-6
        space-y-6
      "
    >
      <div>
        <label
          htmlFor="location"
          className="
            block
            mb-2
            text-sm
            font-medium
            text-slate-300
          "
        >
          Location
        </label>

        <input
          id="location"
          type="text"
          value={location}
          disabled={loading}
          onChange={(event) =>
            setLocation(
              event.target.value
            )
          }
          placeholder="London"
          className="
            w-full
            rounded-lg
            border
            border-slate-700
            bg-slate-900
            px-4
            py-3
            text-white
            outline-none
            focus:border-sky-500
          "
        />
      </div>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-4
        "
      >
        <div>
          <label
            htmlFor="startDate"
            className="
              block
              mb-2
              text-sm
              font-medium
              text-slate-300
            "
          >
            Start Date
          </label>

          <input
            id="startDate"
            type="date"
            value={startDate}
            disabled={loading}
            onChange={(event) =>
              setStartDate(
                event.target.value
              )
            }
            className="
              w-full
              rounded-lg
              border
              border-slate-700
              bg-slate-900
              px-4
              py-3
              text-white
            "
          />
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="
              block
              mb-2
              text-sm
              font-medium
              text-slate-300
            "
          >
            End Date
          </label>

          <input
            id="endDate"
            type="date"
            value={endDate}
            disabled={loading}
            onChange={(event) =>
              setEndDate(
                event.target.value
              )
            }
            className="
              w-full
              rounded-lg
              border
              border-slate-700
              bg-slate-900
              px-4
              py-3
              text-white
            "
          />
        </div>
      </div>

      {validationError && (
        <div
          className="
            rounded-lg
            border
            border-red-500
            bg-red-500/10
            px-4
            py-3
            text-red-300
          "
        >
          {validationError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          rounded-lg
          bg-sky-500
          px-4
          py-3
          font-medium
          text-white
          transition
          hover:bg-sky-600
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {loading
          ? "Processing..."
          : submitButtonText}
      </button>
    </form>
  );
}