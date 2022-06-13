import { Router } from 'express';
import { Route } from './types';
import { joiValidatorMW } from './joi-validator.middleware';
import { defaultOptions, OrionOptions } from './orion';

interface GenerateRouterOptions {
  validation?: OrionOptions['validation'];
}

export function generateRouter(routes: Route[], opts: GenerateRouterOptions): Router {
  const router = Router();
  const validation = { ...defaultOptions.validation, ...opts.validation };
  routes.forEach((r) => {
    // ensure to prefix paths with forward slash just incase
    if (!r.path.startsWith('/')) r.path = `/${r.path}`;

    if (validation.enable) {
      const validator = joiValidatorMW(r, validation.options);
      r.middlewares = r.middlewares?.length ? [validator, ...r.middlewares] : [validator];
    } else {
      r.middlewares = r.middlewares?.length ? r.middlewares : [];
    }

    router[r.method](r.path, ...r.middlewares, r.handler);
  });

  return router;
}
