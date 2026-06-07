import { Router } from "express";

import exportController from "../controllers/export.controller.js";

const router = Router();

router.get(
  "/json",
  exportController.exportAllJson
);

router.get(
  "/json/:id",
  exportController.exportRecordJson
);

router.get(
  "/csv",
  exportController.exportAllCsv
);

router.get(
  "/csv/:id",
  exportController.exportRecordCsv
);

export default router;