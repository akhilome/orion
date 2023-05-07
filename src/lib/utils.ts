import { NextFunction, Request, Response } from 'express';
import { RequestHandler } from './types';

export const defaultOptions = {
  suffix: 'route',
  base: '',
  validation: {
    enabled: false,
    options: { abortEarly: false, stripUnknown: true },
    errorStatusCode: 422,
  },
  logging: {
    enabled: true,
  },
} as const;

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  CONNECT = 'CONNECT',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
  ALL = 'ALL',
}

export class InvalidRouteError extends Error {
  constructor(message: string, public path = 'N/A', public method = 'N/A') {
    super(message);
  }
}

export const handleThrownErrors =
  (handler: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(handler(req, res, next)).catch(next);
  };
