import { useCallback, useEffect, useState } from "react";

import RecordTable from "../components/RecordTable";
import Pagination from "../components/Pagination";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import ExportButtons from "../components/ExportButtons";

import {
  getRecords,
  deleteRecord,
} from "../services/weatherRecordService";

import type {
  WeatherRecord,
} from "../types/weatherRecord";

import { AppError } from "../utils/AppError";

export default function Records() {
  const [records, setRecords] =
    useState<WeatherRecord[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [
    deleteLoading,
    setDeleteLoading,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [location, setLocation] =
    useState("");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [
    selectedRecord,
    setSelectedRecord,
  ] =
    useState<WeatherRecord | null>(
      null
    );

  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState(false);

  const loadRecords =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getRecords(
            page,
            10,
            location || undefined,
            startDate || undefined,
            endDate || undefined
          );

        setRecords(
          response.records
        );

        setTotalPages(
          response.pagination
            .totalPages
        );
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
            "Failed to load records."
          );
        }
      } finally {
        setLoading(false);
      }
    }, [
      page,
      location,
      startDate,
      endDate,
    ]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const handleDeleteClick = (
    record: WeatherRecord
  ) => {
    setSelectedRecord(record);
    setShowDeleteModal(true);
  };

  const handleDelete =
    async () => {
      if (!selectedRecord) {
        return;
      }

      try {
        setDeleteLoading(true);

        await deleteRecord(
          selectedRecord.id
        );

        setShowDeleteModal(
          false
        );

        setSelectedRecord(
          null
        );

        await loadRecords();
      } catch (error) {
        console.error(error);

        setError(
          "Failed to delete record."
        );
      } finally {
        setDeleteLoading(false);
      }
    };

  const handleApplyFilters =
    () => {
      setPage(1);
      loadRecords();
    };

  const handleResetFilters =
    () => {
      setLocation("");
      setStartDate("");
      setEndDate("");
      setPage(1);
    };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <div className="mb-8">

        <div
  className="
    mb-8
    flex
    flex-col
    lg:flex-row
    lg:items-center
    lg:justify-between
    gap-4
  "
>
    <div>
        <h1 className="text-3xl font-bold text-white">
        Weather Records
        </h1>
    </div>

    <ExportButtons />
    </div>
        <p className="mt-2 text-slate-400">
          View, filter and manage
          saved weather records.
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

      <div
        className="
          mb-6
          rounded-xl
          bg-slate-800
          p-4
        "
      >
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
          "
        >
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(
                e.target.value
              )
            }
            className="
              rounded-lg
              border
              border-slate-700
              bg-slate-900
              px-4
              py-3
              text-white
            "
          />

          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(
                e.target.value
              )
            }
            className="
              rounded-lg
              border
              border-slate-700
              bg-slate-900
              px-4
              py-3
              text-white
            "
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              setEndDate(
                e.target.value
              )
            }
            className="
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

        <div
          className="
            mt-4
            flex
            gap-3
          "
        >
          <button
            onClick={
              handleApplyFilters
            }
            className="
              rounded-lg
              bg-sky-500
              px-4
              py-2
              text-white
            "
          >
            Apply Filters
          </button>

          <button
            onClick={
              handleResetFilters
            }
            className="
              rounded-lg
              bg-slate-700
              px-4
              py-2
              text-white
            "
          >
            Reset
          </button>
        </div>
      </div>

      <RecordTable
        records={records}
        loading={loading}
        onDelete={
          handleDeleteClick
        }
      />

      <Pagination
        currentPage={page}
        totalPages={
          totalPages
        }
        loading={loading}
        onPageChange={
          setPage
        }
      />

      <ConfirmDeleteModal
        open={
          showDeleteModal
        }
        record={
          selectedRecord
        }
        loading={
          deleteLoading
        }
        onClose={() => {
          setShowDeleteModal(
            false
          );
          setSelectedRecord(
            null
          );
        }}
        onConfirm={
          handleDelete
        }
      />

    </div>
  );
}