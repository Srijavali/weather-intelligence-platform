import fs from "fs/promises";
import path from "path";

import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";

import { HTTP_STATUS } from "../constants/httpStatus.js";
import { ERROR_CODES } from "../constants/errorCodes.js";

import weatherRecordRepository from "../repositories/weatherRecord.repository.js";

const CSV_EXPORT_DIR = path.resolve("exports/csv");
const JSON_EXPORT_DIR = path.resolve("exports/json");

class ExportService {
  generateTimestamp() {
    return new Date()
      .toISOString()
      .replace(/[:.]/g, "-");
  }

  async exportAllJson(correlationId) {
    const result =
    await weatherRecordRepository.findAll({
        page: 1,
        limit: 100000
    });

    const records = result.records;

    const fileName = `weather-records-${this.generateTimestamp()}.json`;

    const filePath = path.join(
      JSON_EXPORT_DIR,
      fileName
    );

    await fs.writeFile(
      filePath,
      JSON.stringify(records, null, 2),
      "utf-8"
    );

    logger.info({
      correlationId,
      operation: "export_json_all_completed",
      recordCount: records.length,
      fileName
    });

    return {
      fileName,
      filePath
    };
  }

  async exportRecordJson(id, correlationId) {
    const record =
      await weatherRecordRepository.findById(id);

    if (!record) {
      throw new AppError(
        "Weather record not found.",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RECORD_NOT_FOUND
      );
    }

    const fileName =
      `weather-record-${id}-${this.generateTimestamp()}.json`;

    const filePath = path.join(
      JSON_EXPORT_DIR,
      fileName
    );

    await fs.writeFile(
      filePath,
      JSON.stringify(record, null, 2),
      "utf-8"
    );

    logger.info({
      correlationId,
      operation: "export_json_single_completed",
      recordId: id,
      fileName
    });

    return {
      fileName,
      filePath
    };
  }

  convertToCsv(records) {
    if (!records.length) {
      return "";
    }

    const headers = Object.keys(records[0]);

    const rows = records.map((record) =>
      headers
        .map((header) => {
          const value = record[header];

          if (
            value === null ||
            value === undefined
          ) {
            return "";
          }

          return `"${String(value).replace(
            /"/g,
            '""'
          )}"`;
        })
        .join(",")
    );

    return [
      headers.join(","),
      ...rows
    ].join("\n");
  }

  async exportAllCsv(correlationId) {
    const result =
    await weatherRecordRepository.findAll({
        page: 1,
        limit: 100000
    });

    const records = result.records;

    const csv =
      this.convertToCsv(records);

    const fileName =
      `weather-records-${this.generateTimestamp()}.csv`;

    const filePath = path.join(
      CSV_EXPORT_DIR,
      fileName
    );

    await fs.writeFile(
      filePath,
      csv,
      "utf-8"
    );

    logger.info({
      correlationId,
      operation: "export_csv_all_completed",
      recordCount: records.length,
      fileName
    });

    return {
      fileName,
      filePath
    };
  }

  async exportRecordCsv(id, correlationId) {
    const record =
      await weatherRecordRepository.findById(id);

    if (!record) {
      throw new AppError(
        "Weather record not found.",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RECORD_NOT_FOUND
      );
    }

    const csv =
      this.convertToCsv([record]);

    const fileName =
      `weather-record-${id}-${this.generateTimestamp()}.csv`;

    const filePath = path.join(
      CSV_EXPORT_DIR,
      fileName
    );

    await fs.writeFile(
      filePath,
      csv,
      "utf-8"
    );

    logger.info({
      correlationId,
      operation: "export_csv_single_completed",
      recordId: id,
      fileName
    });

    return {
      fileName,
      filePath
    };
  }
}

export default new ExportService();