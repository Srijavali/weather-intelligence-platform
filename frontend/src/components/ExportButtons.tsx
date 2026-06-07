import { useState } from "react";

import {
  exportCsv,
  exportJson,
} from "../services/weatherRecordService";

import { AppError } from "../utils/AppError";

export default function ExportButtons() {
  const [loadingJson, setLoadingJson] =
    useState(false);

  const [loadingCsv, setLoadingCsv] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleJsonExport =
    async () => {
      try {
        setLoadingJson(true);
        setError("");

        await exportJson();

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
            "Failed to export JSON."
          );
        }

      } finally {

        setLoadingJson(false);

      }
    };

  const handleCsvExport =
    async () => {
      try {
        setLoadingCsv(true);
        setError("");

        await exportCsv();

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
            "Failed to export CSV."
          );
        }

      } finally {

        setLoadingCsv(false);

      }
    };

  return (
    <div className="space-y-3">

      {error && (
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
          {error}
        </div>
      )}

      <div
        className="
          flex
          flex-wrap
          gap-3
        "
      >
        <button
          type="button"
          disabled={loadingJson}
          onClick={
            handleJsonExport
          }
          className="
            rounded-lg
            bg-emerald-600
            px-4
            py-2
            text-white
            transition
            hover:bg-emerald-700
            disabled:opacity-50
          "
        >
          {loadingJson
            ? "Exporting..."
            : "Export JSON"}
        </button>

        <button
          type="button"
          disabled={loadingCsv}
          onClick={
            handleCsvExport
          }
          className="
            rounded-lg
            bg-indigo-600
            px-4
            py-2
            text-white
            transition
            hover:bg-indigo-700
            disabled:opacity-50
          "
        >
          {loadingCsv
            ? "Exporting..."
            : "Export CSV"}
        </button>
      </div>

    </div>
  );
}