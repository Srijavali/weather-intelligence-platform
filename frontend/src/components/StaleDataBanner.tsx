interface Props {
  visible: boolean;
}

function StaleDataBanner({
  visible,
}: Props) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className="
        bg-amber-500/20
        border
        border-amber-500
        text-amber-200
        px-4
        py-3
        rounded-xl
        mt-4
        flex
        items-start
        gap-3
      "
      role="status"
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
        Showing cached weather data because
        the live weather service is
        temporarily unavailable.
      </p>
    </div>
  );
}

export default StaleDataBanner;