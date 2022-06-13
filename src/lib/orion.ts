import caller from 'caller';
import { Application } from 'express';
import fg from 'fast-glob';
import { AsyncValidationOptions, ValidationOptions } from 'joi';
import path from 'path';

import { gatherRoutes } from './gather-routes';
import { generateRouter } from './route-generator';
import { routeLogger } from './route-logger';

const DEFAULT_ORION_SUFFIX = 'route';
export interface OrionOptions {
  ext?: 'js' | 'mjs' | 'ts';
  suffix?: string;
  joiValidationOptions?: ValidationOptions | AsyncValidationOptions;
  logging?: {
    supress?: boolean;
  };
}

export function orion(app: Application, opts: OrionOptions = {}) {
  const callerExt = path.extname(caller()).split('.')[1];
  const suffix = opts.suffix || DEFAULT_ORION_SUFFIX;
  const ext = opts.ext || callerExt;

  const paths = fg.sync([`./**/*.${suffix}.${ext}`], { absolute: true });
  const routes = gatherRoutes(paths);

  routeLogger(routes, opts.logging);

  const router = generateRouter(routes);

  app.use(router);

  return app;
}
