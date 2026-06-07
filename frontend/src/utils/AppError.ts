export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string,
    statusCode?: number
  ) {
    super(message);

    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = true;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}