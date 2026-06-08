import type { WeatherData } from "../types/weather";

interface Props {
  weather: WeatherData;
}

function WeatherCard({
  weather,
}: Props) {
  return (
    <div
      className="
        bg-slate-800
        rounded-2xl
        p-4
        sm:p-6
        mt-8
        shadow-lg
      "
    >
      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          gap-4
        "
      >
        <img
          src={weather.icon}
          alt={weather.condition}
          className="
            w-16
            h-16
            self-center
            sm:self-auto
          "
        />

        <div
          className="
            text-center
            sm:text-left
          "
        >
          <h2
            className="
              text-2xl
              sm:text-3xl
              font-bold
              break-words
            "
          >
            {weather.city}
          </h2>

          <p className="text-slate-400">
            {weather.country}
          </p>
        </div>
      </div>

      <p
        className="
          text-slate-400
          text-xs
          sm:text-sm
          mt-3
          break-all
          text-center
          sm:text-left
        "
      >
        📍 {weather.latitude},{" "}
        {weather.longitude}
      </p>

      {/* ===== MAP SECTION ADDED ===== */}

      <h3
        className="
          text-lg
          font-semibold
          mt-6
          mb-3
          text-center
          sm:text-left
        "
      >
        Location Map
      </h3>

      <div
        className="
          rounded-xl
          overflow-hidden
          border
          border-slate-700
        "
      >
        <iframe
          title="location-map"
          className="
            w-full
            h-56
            sm:h-72
            md:h-80
            lg:h-96
          "
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${
            weather.longitude - 0.05
          },${
            weather.latitude - 0.05
          },${
            weather.longitude + 0.05
          },${
            weather.latitude + 0.05
          }&marker=${weather.latitude},${weather.longitude}`}
        />
      </div>

      <div
        className="
          mt-3
          text-center
        "
      >
        <a
          href={`https://www.openstreetmap.org/?mlat=${weather.latitude}&mlon=${weather.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-block
            px-4
            py-2
            rounded-lg
            bg-blue-600
            hover:bg-blue-700
            transition
            text-sm
            sm:text-base
            font-medium
          "
        >
          View Full Map
        </a>
      </div>

      {/* ===== EXISTING CONTENT CONTINUES ===== */}

      <div
        className="
          mt-6
          text-center
          sm:text-left
        "
      >
        <h3
          className="
            text-4xl
            sm:text-5xl
            font-bold
          "
        >
          {weather.temperature}°C
        </h3>

        <p
          className="
            text-lg
            sm:text-xl
            mt-2
          "
        >
          {weather.condition}
        </p>
      </div>

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-5
          gap-4
          mt-8
        "
      >
        <div
          className="
            bg-slate-700
            rounded-xl
            p-4
          "
        >
          <p
            className="
              text-slate-400
              text-sm
            "
          >
            Feels Like
          </p>

          <p
            className="
              text-xl
              sm:text-2xl
              font-semibold
              mt-2
            "
          >
            {weather.feelsLike}°C
          </p>
        </div>

        <div
          className="
            bg-slate-700
            rounded-xl
            p-4
          "
        >
          <p
            className="
              text-slate-400
              text-sm
            "
          >
            Humidity
          </p>

          <p
            className="
              text-xl
              sm:text-2xl
              font-semibold
              mt-2
            "
          >
            {weather.humidity}%
          </p>
        </div>

        <div
          className="
            bg-slate-700
            rounded-xl
            p-4
          "
        >
          <p
            className="
              text-slate-400
              text-sm
            "
          >
            Wind Speed
          </p>

          <p
            className="
              text-xl
              sm:text-2xl
              font-semibold
              mt-2
            "
          >
            {weather.windSpeed} km/h
          </p>
        </div>

        <div
          className="
            bg-slate-700
            rounded-xl
            p-4
          "
        >
          <p
            className="
              text-slate-400
              text-sm
            "
          >
            Pressure
          </p>

          <p
            className="
              text-xl
              sm:text-2xl
              font-semibold
              mt-2
            "
          >
            {weather.pressure} mb
          </p>
        </div>

        <div
          className="
            bg-slate-700
            rounded-xl
            p-4
          "
        >
          <p
            className="
              text-slate-400
              text-sm
            "
          >
            Visibility
          </p>

          <p
            className="
              text-xl
              sm:text-2xl
              font-semibold
              mt-2
            "
          >
            {weather.visibility} km
          </p>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;