import path from "path";

import asyncHandler from "../utils/asyncHandler.js";

import exportService from "../services/export.service.js";

class ExportController {
  exportAllJson = asyncHandler(async (req, res) => {
    const result =
      await exportService.exportAllJson(
        req.correlationId
      );

    return res.download(
      path.resolve(result.filePath),
      result.fileName
    );
  });

  exportRecordJson = asyncHandler(async (req, res) => {
    const result =
      await exportService.exportRecordJson(
        Number(req.params.id),
        req.correlationId
      );

    return res.download(
      path.resolve(result.filePath),
      result.fileName
    );
  });

  exportAllCsv = asyncHandler(async (req, res) => {
    const result =
      await exportService.exportAllCsv(
        req.correlationId
      );

    return res.download(
      path.resolve(result.filePath),
      result.fileName
    );
  });

  exportRecordCsv = asyncHandler(async (req, res) => {
    const result =
      await exportService.exportRecordCsv(
        Number(req.params.id),
        req.correlationId
      );

    return res.download(
      path.resolve(result.filePath),
      result.fileName
    );
  });
}

export default new ExportController();