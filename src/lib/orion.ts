import caller from 'caller';
import { Application } from 'express';
import fg from 'fast-glob';
import { AsyncValidationOptions, ValidationOptions } from 'joi';
import path from 'path';

import { gatherRoutes } from './gather-routes';
import { generateRouter } from './route-generator';
import { routeLogger } from './route-logger';
import { validatePeerDeps } from './utils';

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
  const callSite = caller();
  const callerExt = path.extname(callSite).split('.')[1];
  const suffix = opts.suffix as string;
  const ext = opts.ext || callerExt;

  // ensure required dependencies are installed
  validatePeerDeps(opts);

  const paths = fg.sync([`./**/*.${suffix}.${ext}`], {
    absolute: true,
    cwd: path.dirname(callSite),
  });

  const routes = gatherRoutes(paths);

  routeLogger(routes, opts.logging);

  const router = generateRouter(routes, opts);

  app.use(router);

  return app;
}
