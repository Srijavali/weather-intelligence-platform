import { Router } from "express";

import weatherRecordController from "../controllers/weatherRecord.controller.js";

const router = Router();

router.post(
  "/",
  weatherRecordController.create
);

router.get(
  "/",
  weatherRecordController.getAll
);

router.get(
  "/:id",
  weatherRecordController.getById
);

router.put(
  "/:id",
  weatherRecordController.update
);

router.delete(
  "/:id",
  weatherRecordController.delete
);

export default router;