import pool from "../db/pool.js";

class WeatherRecordRepository {
  async create(record) {
    const query = `
      INSERT INTO weather_records (
        location_input,
        normalized_location,
        country,
        region,
        latitude,
        longitude,
        start_date,
        end_date,
        temperature_c,
        feels_like_c,
        condition,
        humidity,
        wind_kph,
        pressure_mb,
        visibility_km,
        icon_url
      )
      VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8,
        $9, $10, $11, $12,
        $13, $14, $15, $16
      )
      RETURNING *;
    `;

    const values = [
      record.locationInput,
      record.normalizedLocation,
      record.country,
      record.region,
      record.latitude,
      record.longitude,
      record.startDate,
      record.endDate,
      record.temperatureC,
      record.feelsLikeC,
      record.condition,
      record.humidity,
      record.windKph,
      record.pressureMb,
      record.visibilityKm,
      record.iconUrl
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
  }

  async findById(id) {
    const query = `
      SELECT *
      FROM weather_records
      WHERE id = $1;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0] || null;
  }

  async findAll(filters = {}) {
  const {
    location,
    startDate,
    endDate,
    page = 1,
    limit = 10
  } = filters;

  const conditions = [];
  const values = [];

  let paramIndex = 1;

  if (location) {
    conditions.push(
      `normalized_location ILIKE $${paramIndex}`
    );

    values.push(`%${location}%`);
    paramIndex++;
  }

  if (startDate) {
    conditions.push(
      `start_date >= $${paramIndex}`
    );

    values.push(startDate);
    paramIndex++;
  }

  if (endDate) {
    conditions.push(
      `end_date <= $${paramIndex}`
    );

    values.push(endDate);
    paramIndex++;
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM weather_records
    ${whereClause}
  `;

  const countResult =
    await pool.query(countQuery, values);

  const totalRecords =
    Number(countResult.rows[0].total);

  const offset =
    (page - 1) * limit;

  const query = `
    SELECT *
    FROM weather_records
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${paramIndex}
    OFFSET $${paramIndex + 1}
  `;

  const result = await pool.query(
    query,
    [
      ...values,
      limit,
      offset
    ]
  );

  return {
    records: result.rows,
    totalRecords
  };
}

  async update(id, record) {
    const query = `
      UPDATE weather_records
      SET
        location_input = $1,
        normalized_location = $2,
        country = $3,
        region = $4,
        latitude = $5,
        longitude = $6,
        start_date = $7,
        end_date = $8,
        temperature_c = $9,
        feels_like_c = $10,
        condition = $11,
        humidity = $12,
        wind_kph = $13,
        pressure_mb = $14,
        visibility_km = $15,
        icon_url = $16
      WHERE id = $17
      RETURNING *;
    `;

    const values = [
      record.locationInput,
      record.normalizedLocation,
      record.country,
      record.region,
      record.latitude,
      record.longitude,
      record.startDate,
      record.endDate,
      record.temperatureC,
      record.feelsLikeC,
      record.condition,
      record.humidity,
      record.windKph,
      record.pressureMb,
      record.visibilityKm,
      record.iconUrl,
      id
    ];

    const result = await pool.query(query, values);

    return result.rows[0] || null;
  }

  async delete(id) {
    const query = `
      DELETE FROM weather_records
      WHERE id = $1
      RETURNING *;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0] || null;
  }
}

export default new WeatherRecordRepository();