import { RequestHandler as Handler } from 'express';
import { AsyncValidationOptions, ObjectSchema, ValidationOptions } from 'joi';
import { HttpMethod } from './utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RequestHandler = Handler<any, any, any, any>;
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
