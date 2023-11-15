import httpStatus from 'http-status';

type ApiErrorType = {
  statusCode: number;
  status: boolean;
  message?: string;
  options?: object;
};

type ErrorType = {
  message: string;
  options?: object;
  statusCode?: number;
};

class ApiError extends Error {
  statusCode;
  status;
  options;
  constructor({ statusCode, message, status, options }: ApiErrorType) {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
    this.options = options || {};
  }
}

export class BadRequest extends ApiError {
  constructor({ message, options }: ErrorType) {
    super({
      message,
      statusCode: Number(httpStatus[502]),
      status: false,
      options,
    });
  }
}

export class ErrorFromResponse extends ApiError {
  constructor({ message, options, statusCode }: ErrorType) {
    super({
      message,
      statusCode: statusCode || Number(httpStatus[400]),
      status: false,
      options,
    });
  }
}
