import { RequestHandler } from 'express';
import { AsyncValidationOptions, ObjectSchema, ValidationOptions } from 'joi';

export interface Route<P = unknown> {
  path: string;
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'ALL';
  handler: RequestHandler<P>;
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
  validation?: {
    enable?: boolean;
    options?: ValidationOptions | AsyncValidationOptions;
  };
  logging?: {
    enable?: boolean;
  };
}
