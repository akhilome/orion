import caller from 'caller';
import { Application } from 'express';
import fg from 'fast-glob';
import { AsyncValidationOptions, ValidationOptions } from 'joi';
import path from 'path';

import { gatherRoutes } from './gather-routes';
import { generateRouter } from './route-generator';
import { routeLogger } from './route-logger';

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

export const defaultOptions = {
  suffix: 'route',
  validation: {
    enable: true,
    options: { abortEarly: false, stripUnknown: true },
  },
  logging: {
    enable: true,
  },
} as const;

export function orion(app: Application, opts: OrionOptions = defaultOptions) {
  opts = { ...defaultOptions, ...opts };
  const callerExt = path.extname(caller()).split('.')[1];
  const suffix = opts.suffix || defaultOptions.suffix;
  const ext = opts.ext || callerExt;

  const paths = fg.sync([`./**/*.${suffix}.${ext}`], { absolute: true });
  const routes = gatherRoutes(paths);

  routeLogger(routes, opts.logging);

  const router = generateRouter(routes, opts);

  app.use(router);

  return app;
}
