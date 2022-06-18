import { RequestHandler } from 'express';
import { ObjectSchema } from 'joi';

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
  middlewares?: RequestHandler[]; // TODO: support middlewares
}

export interface RouteFile {
  routes: Route[];
  meta?: RoutesMeta;
}
