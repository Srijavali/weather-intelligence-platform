import dotenv from "dotenv";

dotenv.config();

const requiredVariables = [
  "PORT",
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "WEATHER_API_KEY",
  "WEATHER_API_BASE_URL",
  "NOMINATIM_BASE_URL"
];

const missingVariables = requiredVariables.filter(
  (variableName) => !process.env[variableName]
);

if (missingVariables.length > 0) {
  console.error(
    `Missing required environment variables: ${missingVariables.join(", ")}`
  );

  process.exit(1);
}

const port = parseInt(process.env.PORT, 10);

if (Number.isNaN(port)) {
  console.error("PORT must be a valid number");
  process.exit(1);
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",

  port,

  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },

  weather: {
    apiKey: process.env.WEATHER_API_KEY,
    baseUrl: process.env.WEATHER_API_BASE_URL
  },

  nominatim: {
    baseUrl: process.env.NOMINATIM_BASE_URL
  }
};

export default env;