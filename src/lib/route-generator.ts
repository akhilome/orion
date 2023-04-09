import { Router } from 'express';
import { OrionOptions, Route } from './types';
import { schemaValidator } from './joi';
import { defaultOptions, handleThrownErrors } from './utils';

interface GenerateRouterOptions {
  validation?: OrionOptions['validation'];
}

export function generateRouter(routes: Route[], opts: GenerateRouterOptions): Router {
  const router = Router();
  const validation = { ...defaultOptions.validation, ...opts.validation };
  routes.forEach((r) => {
    if (validation.enabled) {
      const validator = schemaValidator(r, validation);
      r.middlewares = r.middlewares?.length ? [validator, ...r.middlewares] : [validator];
    } else {
      r.middlewares = r.middlewares?.length ? r.middlewares : [];
    }

    const method = r.method.toLowerCase() as Lowercase<typeof r.method>;
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    router[method](r.path, ...r.middlewares, handleThrownErrors(r.handler));
  });

  return router;
}
