import {
  safeGetItem,
  safeSetItem,
  safeRemoveItem,
} from "./storage";

const CACHE_PREFIX = "weather_";

/**
 * Fresh cache validity
 */
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Stale cache retention
 * Used only for fallback when API fails.
 */
const STALE_CACHE_TTL =
  12 * 60 * 60 * 1000; // 12 hours

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Generates a normalized cache key.
 */
function getCacheKey(
  location: string
): string {
  return `${CACHE_PREFIX}${location
    .trim()
    .toLowerCase()}`;
}

/**
 * Retrieves cached weather data
 * only if it is still fresh.
 */
export function getCachedWeather<T>(
  location: string
): T | null {
  const key = getCacheKey(location);

  const raw = safeGetItem(key);

  if (!raw) {
    return null;
  }

  try {
    const parsed: CacheEntry<T> =
      JSON.parse(raw);

    const isExpired =
      Date.now() - parsed.timestamp >
      CACHE_TTL;

    /**
     * IMPORTANT:
     * Do NOT delete expired cache here.
     *
     * We want expired data to remain
     * available as stale fallback if
     * the weather API becomes unavailable.
     */
    if (isExpired) {
      return null;
    }

    return parsed.data;
  } catch {
    // Corrupted cache entry
    safeRemoveItem(key);
    return null;
  }
}

/**
 * Returns cached weather data
 * regardless of freshness.
 *
 * Used only as a resilience fallback
 * when live weather requests fail.
 */
export function getStaleWeather<T>(
  location: string
): T | null {
  const key = getCacheKey(location);

  const raw = safeGetItem(key);

  if (!raw) {
    return null;
  }

  try {
    const parsed: CacheEntry<T> =
      JSON.parse(raw);

    const isTooOld =
      Date.now() - parsed.timestamp >
      STALE_CACHE_TTL;

    if (isTooOld) {
      return null;
    }

    return parsed.data;
  } catch {
    safeRemoveItem(key);
    return null;
  }
}

/**
 * Saves weather data to cache.
 */
export function saveWeatherCache<T>(
  location: string,
  data: T
): void {
  const key = getCacheKey(location);

  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
  };

  const success = safeSetItem(
    key,
    JSON.stringify(entry)
  );

  /**
   * Storage may be full.
   * Attempt cleanup and retry once.
   */
  if (!success) {
    cleanupExpiredCache();

    safeSetItem(
      key,
      JSON.stringify(entry)
    );
  }
}

/**
 * Removes a single cache entry.
 */
export function invalidateWeatherCache(
  location: string
): void {
  safeRemoveItem(
    getCacheKey(location)
  );
}

/**
 * Clears all weather cache entries.
 */
export function clearWeatherCache(): void {
  try {
    const keysToRemove: string[] =
      [];

    for (
      let i = 0;
      i < localStorage.length;
      i++
    ) {
      const key =
        localStorage.key(i);

      if (
        key &&
        key.startsWith(
          CACHE_PREFIX
        )
      ) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) =>
      safeRemoveItem(key)
    );
  } catch {
    // Fail silently
  }
}

/**
 * Removes cache entries that are
 * older than the stale retention period
 * or corrupted.
 *
 * Should run on application startup.
 */
export function cleanupExpiredCache(): void {
  try {
    const keysToRemove: string[] =
      [];

    for (
      let i = 0;
      i < localStorage.length;
      i++
    ) {
      const key =
        localStorage.key(i);

      if (
        !key ||
        !key.startsWith(
          CACHE_PREFIX
        )
      ) {
        continue;
      }

      const raw =
        localStorage.getItem(key);

      if (!raw) {
        keysToRemove.push(key);
        continue;
      }

      try {
        const parsed: CacheEntry<unknown> =
          JSON.parse(raw);

        /**
         * Remove only data older
         * than stale retention period.
         */
        const isTooOld =
          Date.now() -
            parsed.timestamp >
          STALE_CACHE_TTL;

        if (isTooOld) {
          keysToRemove.push(key);
        }
      } catch {
        // Corrupted cache
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) =>
      safeRemoveItem(key)
    );
  } catch {
    // Fail silently
  }
}