import { Router } from 'express';
import { Route } from './types';
import { joiValidatorMW } from './joi-validator.middleware';
import { OrionOptions } from './orion';

interface GenerateRouterOptions {
  joiSpecOptions?: OrionOptions['joiValidationOptions'];
}

export function generateRouter(routes: Route[], opts: GenerateRouterOptions = {}): Router {
  const router = Router();
  routes.forEach((route) => {
    // ensure to prefix paths with forward slash just incase
    if (!route.path.startsWith('/')) route.path = `/${route.path}`;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const validator = joiValidatorMW(route, opts.joiSpecOptions);

    if (route.middlewares && route.middlewares.length) {
      route.middlewares = [validator, ...route.middlewares];
    } else {
      route.middlewares = [validator];
    }

    router[route.method](route.path, ...route.middlewares, route.handler);
  });

  return router;
}
