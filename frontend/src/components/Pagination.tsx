interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (
    page: number
  ) => void;

  loading?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages =
    Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );

  return (
    <div
      className="
        flex
        flex-wrap
        justify-center
        gap-2
        mt-6
      "
    >
      <button
        type="button"
        disabled={
          loading ||
          currentPage === 1
        }
        onClick={() =>
          onPageChange(
            currentPage - 1
          )
        }
        className="
          rounded-lg
          bg-slate-700
          px-4
          py-2
          text-white
          disabled:opacity-50
        "
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          disabled={loading}
          onClick={() =>
            onPageChange(page)
          }
          className={`
            px-4 py-2 rounded-lg
            ${
              page === currentPage
                ? "bg-sky-500 text-white"
                : "bg-slate-700 text-white"
            }
          `}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={
          loading ||
          currentPage === totalPages
        }
        onClick={() =>
          onPageChange(
            currentPage + 1
          )
        }
        className="
          rounded-lg
          bg-slate-700
          px-4
          py-2
          text-white
          disabled:opacity-50
        "
      >
        Next
      </button>
    </div>
  );
}