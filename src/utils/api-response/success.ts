import express from 'express';
import httpStatus from 'http-status';

type SuccessResponseType = {
  message: string;
  data: any;
  statusCode: number;
  options?: object;
};

type CreatedSuccess = {
  message: string;
  data: any;
  options?: object;
};

export class SuccessResponse {
  message;
  data;
  statusCode;
  options;
  constructor({ message, data, statusCode, options }: SuccessResponseType) {
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
    this.options = options || {};
  }

  send(res: express.Response) {
    return res.status(this.statusCode).json(this);
  }
}

export class CreateSuccess extends SuccessResponse {
  constructor({ message, data, options }: CreatedSuccess) {
    super({ message, data, statusCode: httpStatus.CREATED, options });
  }
}

export class PostSuccess extends SuccessResponse {
  constructor({ message, data, options }: CreatedSuccess) {
    super({ message, data, statusCode: httpStatus.OK, options });
  }
}
