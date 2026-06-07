import { Router } from "express";

import weatherController from "../controllers/weather.controller.js";

const router = Router();

/*
 * GET /api/weather?location=London
 */
router.get("/", weatherController.getCurrentWeather);

export default router;