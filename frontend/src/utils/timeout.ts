export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 10000,
  externalSignal?: AbortSignal
) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  const signal = externalSignal || controller.signal;

  try {
    return await fetch(url, {
      ...options,
      signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}