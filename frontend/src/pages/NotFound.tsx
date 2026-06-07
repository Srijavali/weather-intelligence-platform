import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">
        404
      </h1>

      <p className="text-gray-600">
        Page not found.
      </p>

      <Link
        to="/"
        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;