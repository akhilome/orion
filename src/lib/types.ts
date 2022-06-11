import { RequestHandler } from 'express';
import { ObjectSchema } from 'joi';

export interface Route<P = unknown> {
  path: string;
  method: 'get' | 'post' | 'patch' | 'put' | 'all';
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
