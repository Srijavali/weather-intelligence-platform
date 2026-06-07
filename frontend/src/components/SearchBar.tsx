import { useState } from "react";

interface Props {
  onSearch: (location: string) => void;
  loading: boolean;
}

function SearchBar({
  onSearch,
  loading,
}: Props) {
  const [location, setLocation] =
    useState("");

  const handleSearch = () => {
    const trimmed =
      location.trim();

    if (!trimmed) {
      return;
    }

    if (trimmed.length > 100) {
      return;
    }

    onSearch(trimmed);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      className="
        bg-slate-800
        rounded-2xl
        p-4
        sm:p-6
        shadow-lg
      "
    >
      <div
        className="
          flex
          flex-col
          sm:flex-row
          gap-3
        "
      >
        <input
          type="text"
          value={location}
          onChange={(e) =>
            setLocation(
              e.target.value
            )
          }
          onKeyDown={
            handleKeyDown
          }
          disabled={loading}
          maxLength={100}
          placeholder="Search by city, zip code, landmark or coordinates"
          aria-label="Weather location search"
          className="
            flex-1
            w-full
            px-4
            py-3
            rounded-xl
            bg-slate-700
            text-white
            outline-none
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        />

        <button
          onClick={
            handleSearch
          }
          disabled={loading}
          className="
            w-full
            sm:w-auto
            bg-sky-500
            hover:bg-sky-600
            disabled:bg-slate-600
            disabled:cursor-not-allowed
            px-6
            py-3
            rounded-xl
            font-semibold
            transition-colors
          "
        >
          {loading
            ? "Loading..."
            : "🔍 Search"}
        </button>
      </div>
    </div>
  );
}

export default SearchBar;