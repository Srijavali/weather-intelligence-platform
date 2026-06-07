import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import requestContext from "./middleware/requestContext.js";
import requestLogger from "./middleware/requestLogger.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

import weatherRoutes from "./routes/weather.routes.js";
import weatherRecordRoutes from "./routes/weatherRecord.routes.js";
import exportRoutes from "./routes/export.routes.js";

const app = express();

/*
|--------------------------------------------------------------------------
| Proxy Trust
|--------------------------------------------------------------------------
*/

app.set("trust proxy", 1);

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

app.use(cors());

/*
|--------------------------------------------------------------------------
| Correlation IDs
|--------------------------------------------------------------------------
*/

app.use(requestContext);

/*
|--------------------------------------------------------------------------
| Compression
|--------------------------------------------------------------------------
*/

app.use(compression());

/*
|--------------------------------------------------------------------------
| Body Parsers
|--------------------------------------------------------------------------
*/

app.use(
  express.json({
    limit: "1mb"
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb"
  })
);

/*
|--------------------------------------------------------------------------
| Rate Limiting
|--------------------------------------------------------------------------
*/

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many requests. Please try again later."
  }
});

app.use("/api", apiLimiter);

/*
|--------------------------------------------------------------------------
| Request Logging
|--------------------------------------------------------------------------
*/

app.use(requestLogger);

/*
|--------------------------------------------------------------------------
| Health Route
|--------------------------------------------------------------------------
*/

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Weather Intelligence Platform API is healthy",
    correlationId: req.correlationId,
    timestamp: new Date().toISOString()
  });
});

/*
|--------------------------------------------------------------------------
| Test Error Route
|--------------------------------------------------------------------------
*/

app.get("/api/test-error", (req, res, next) => {
  next(new Error("Test error"));
});

/*
|--------------------------------------------------------------------------
| Future Routes
|--------------------------------------------------------------------------
*/

app.use("/api/weather", weatherRoutes);

app.use(
  "/api/weather-records",
  weatherRecordRoutes
);

app.use(
  "/api/exports",
  exportRoutes
);
/*
|--------------------------------------------------------------------------
| Not Found
|--------------------------------------------------------------------------
*/

app.use(notFound);

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

export default app;