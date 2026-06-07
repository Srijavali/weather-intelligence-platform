import type {
  WeatherRecord,
} from "../types/weatherRecord";

interface ConfirmDeleteModalProps {
  open: boolean;

  record: WeatherRecord | null;

  loading?: boolean;

  onClose: () => void;

  onConfirm: () => Promise<void>;
}

export default function ConfirmDeleteModal({
  open,
  record,
  loading = false,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!open || !record) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/60
        p-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-xl
          bg-slate-800
          p-6
        "
      >
        <h2
          className="
            text-xl
            font-bold
            text-white
          "
        >
          Delete Record
        </h2>

        <p
          className="
            mt-4
            text-slate-300
          "
        >
          Are you sure you want to
          delete:
        </p>

        <div
          className="
            mt-3
            rounded-lg
            bg-slate-900
            p-4
          "
        >
          <p className="text-white">
            {
              record.location_input
            }
          </p>

          <p className="text-slate-400 text-sm">
            {record.country}
          </p>
        </div>

        <p
          className="
            mt-4
            text-red-300
            text-sm
          "
        >
          This action cannot be
          undone.
        </p>

        <div
          className="
            mt-6
            flex
            justify-end
            gap-3
          "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              rounded-lg
              bg-slate-700
              px-4
              py-2
              text-white
            "
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="
              rounded-lg
              bg-red-600
              px-4
              py-2
              text-white
            "
          >
            {loading
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}