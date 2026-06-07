export function successResponse({
  message,
  data = null,
  correlationId = null
}) {
  return {
    success: true,
    message,
    correlationId,
    data
  };
}

export function errorResponse({
  message,
  code = null,
  correlationId = null,
  details = null
}) {
  return {
    success: false,
    message,
    code,
    correlationId,
    details
  };
}