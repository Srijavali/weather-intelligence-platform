let currentController: AbortController | null = null;

export function createNewRequest() {
  if (currentController) {
    currentController.abort();
  }

  currentController = new AbortController();

  return currentController.signal;
}