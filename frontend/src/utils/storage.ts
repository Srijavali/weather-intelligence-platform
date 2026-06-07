export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

export function isStorageAvailable(): boolean {
  try {
    const key = "__storage_test__";

    localStorage.setItem(key, key);
    localStorage.removeItem(key);

    return true;
  } catch {
    return false;
  }
}

export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // noop
  }
}

export function safeSetItem(
  key: string,
  value: string
): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}