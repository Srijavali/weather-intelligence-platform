import { Link } from "react-router-dom";

import type {
  WeatherRecord,
} from "../types/weatherRecord";

interface RecordTableProps {
  records: WeatherRecord[];

  loading?: boolean;

  onDelete: (
    record: WeatherRecord
  ) => void;
}

function formatDate(
  value: string
) {
  return new Date(
    value
  ).toLocaleDateString();
}

export default function RecordTable({
  records,
  loading = false,
  onDelete,
}: RecordTableProps) {
  if (loading) {
    return (
      <div
        className="
          rounded-xl
          bg-slate-800
          p-8
          text-center
          text-slate-300
        "
      >
        Loading records...
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div
        className="
          rounded-xl
          bg-slate-800
          p-8
          text-center
          text-slate-300
        "
      >
        No records found.
      </div>
    );
  }

  return (
    <div
      className="
        overflow-x-auto
        rounded-xl
        bg-slate-800
        shadow-lg
      "
    >
      <table
        className="
          min-w-full
          divide-y
          divide-slate-700
        "
      >
        <thead>
          <tr
            className="
              bg-slate-900
            "
          >
            <th className="px-4 py-3 text-left text-sm text-slate-300">
              Location
            </th>

            <th className="px-4 py-3 text-left text-sm text-slate-300">
              Country
            </th>

            <th className="px-4 py-3 text-left text-sm text-slate-300">
              Temperature
            </th>

            <th className="px-4 py-3 text-left text-sm text-slate-300">
              Condition
            </th>

            <th className="px-4 py-3 text-left text-sm text-slate-300">
              Start
            </th>

            <th className="px-4 py-3 text-left text-sm text-slate-300">
              End
            </th>

            <th className="px-4 py-3 text-center text-sm text-slate-300">
              Actions
            </th>
          </tr>
        </thead>

        <tbody
          className="
            divide-y
            divide-slate-700
          "
        >
          {records.map(
            (record) => (
              <tr
                key={record.id}
              >
                <td className="px-4 py-4 text-white">
                  {
                    record.location_input
                  }
                </td>

                <td className="px-4 py-4 text-white">
                  {record.country}
                </td>

                <td className="px-4 py-4 text-white">
                  {
                    record.temperature_c
                  }
                  °C
                </td>

                <td className="px-4 py-4 text-white">
                  <div className="flex items-center gap-2">
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
                      className="h-8 w-8"
                    />

                    <span>
                      {
                        record.condition
                      }
                    </span>
                  </div>
                </td>

                <td className="px-4 py-4 text-white">
                  {formatDate(
                    record.start_date
                  )}
                </td>

                <td className="px-4 py-4 text-white">
                  {formatDate(
                    record.end_date
                  )}
                </td>

                <td
                  className="
                    px-4
                    py-4
                  "
                >
                  <div
                    className="
                      flex
                      flex-wrap
                      justify-center
                      gap-2
                    "
                  >
                    <Link
                      to={`/records/${record.id}`}
                      className="
                        rounded-lg
                        bg-sky-500
                        px-3
                        py-2
                        text-sm
                        text-white
                      "
                    >
                      View
                    </Link>

                    <Link
                      to={`/records/${record.id}/edit`}
                      className="
                        rounded-lg
                        bg-amber-500
                        px-3
                        py-2
                        text-sm
                        text-white
                      "
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(
                          record
                        )
                      }
                      className="
                        rounded-lg
                        bg-red-600
                        px-3
                        py-2
                        text-sm
                        text-white
                      "
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}