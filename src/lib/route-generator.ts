import { Router } from 'express';
import { OrionOptions, Route } from './types';
import { joiValidatorMW } from './joi-validator.middleware';
import { defaultOptions } from './utils';

interface GenerateRouterOptions {
  validation?: OrionOptions['validation'];
}

export function generateRouter(routes: Route[], opts: GenerateRouterOptions): Router {
  const router = Router();
  const validation = { ...defaultOptions.validation, ...opts.validation };
  routes.forEach((r) => {
    if (validation.enable) {
      const validator = joiValidatorMW(r, validation.options);
      r.middlewares = r.middlewares?.length ? [validator, ...r.middlewares] : [validator];
    } else {
      r.middlewares = r.middlewares?.length ? r.middlewares : [];
    }

    const method = r.method.toLowerCase() as Lowercase<typeof r.method>;
    router[method](r.path, ...r.middlewares, r.handler);
  });

  return router;
}
