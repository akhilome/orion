/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, RequestHandler as Handler, Response } from 'express';
import { AsyncValidationOptions, ObjectSchema, ValidationOptions } from 'joi';
import { HttpMethod } from './utils';

export interface RequestHandler<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
  Locals extends Record<string, any> = Record<string, any>,
> extends Handler<P, ResBody, ReqBody, ReqQuery, Locals> {
  (
    req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
    res: Response<ResBody, Locals>,
    next: NextFunction,
  ): void | Promise<void> | Response | Promise<Response>;
}

export interface Route {
  path: string;
  method: Uppercase<HttpMethod>;
  handler: RequestHandler;
  validator?: {
    body?: ObjectSchema;
    query?: ObjectSchema;
    params?: ObjectSchema;
    skip?: boolean;
  };
  middlewares?: RequestHandler[];
}

export interface RoutesMeta {
  base?: string;
  middlewares?: RequestHandler[];
}

export interface RouteFile {
  routes: Route[];
  meta?: RoutesMeta;
}

export interface OrionOptions {
  ext?: 'js' | 'mjs' | 'ts';
  suffix?: string;
  base?: string;
  validation?: {
    enable?: boolean;
    options?: ValidationOptions | AsyncValidationOptions;
  };
  logging?: {
    enable?: boolean;
  };
}
