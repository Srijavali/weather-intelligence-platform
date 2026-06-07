import type { ForecastDay } from "../types/weather";

interface Props {
  forecast: ForecastDay;
}

function ForecastCard({
  forecast,
}: Props) {
  return (
    <div
      className="
        bg-slate-800
        rounded-xl
        p-4
        text-center
        shadow-md
        min-h-[220px]
        flex
        flex-col
        items-center
        justify-between
        transition-transform
        duration-300
        md:hover:scale-105
        md:hover:bg-slate-700
      "
    >
      <p
        className="
          text-xs
          sm:text-sm
          text-slate-400
        "
      >
        {new Date(
          forecast.date
        ).toLocaleDateString(
          "en-US",
          {
            weekday: "short",
            month: "short",
            day: "numeric",
          }
        )}
      </p>

      <img
        src={forecast.icon}
        alt={forecast.condition}
        className="
          w-16
          h-16
          mx-auto
        "
      />

      <div>
        <p
          className="
            text-lg
            sm:text-xl
            font-medium
          "
        >
          {forecast.maxTemp}°
        </p>

        <p
          className="
            text-sm
            text-slate-400
          "
        >
          {forecast.minTemp}°
        </p>
      </div>

      <p
        className="
          text-xs
          text-slate-400
          leading-relaxed
          break-words
          max-w-full
        "
      >
        {forecast.condition}
      </p>
    </div>
  );
}

export default ForecastCard;