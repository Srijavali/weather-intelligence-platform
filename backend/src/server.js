import app from "./app.js";
import env from "./config/env.js";
import pool from "./db/pool.js";

let server;

async function startServer() {
  try {
    await pool.query("SELECT 1");

    console.log("Database connected successfully");

    server = app.listen(env.port, () => {
      console.log(
        `Server running on port ${env.port}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start application:",
      error.message
    );

    process.exit(1);
  }
}

startServer();

/*
|--------------------------------------------------------------------------
| Graceful Shutdown
|--------------------------------------------------------------------------
*/

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);

  try {
    if (server) {
      server.close();
    }

    await pool.end();

    console.log("Shutdown complete");

    process.exit(0);
  } catch (error) {
    console.error("Shutdown error:", error);

    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));