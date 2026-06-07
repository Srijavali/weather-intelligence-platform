interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({
  message,
}: ErrorMessageProps) {
  return (
    <div
      className="
        bg-red-500/10
        border
        border-red-500
        text-red-400
        p-4
        rounded-xl
        mt-4
        flex
        items-start
        gap-3
      "
      role="alert"
    >
      <span
        className="
          text-lg
          flex-shrink-0
        "
      >
        ⚠️
      </span>

      <p
        className="
          text-sm
          sm:text-base
          break-words
        "
      >
        {message}
      </p>
    </div>
  );
}

export default ErrorMessage;