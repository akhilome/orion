import cloneDeep from 'lodash/cloneDeep';
import { Route, RouteFile } from './types';
import { HttpMethod, InvalidRouteError } from './utils';

type GatherRoutesOpts = {
  base?: string;
};
export function gatherRoutes(paths: string[], opts: GatherRoutesOpts) {
  const pathsWithErrors: string[] = []; // TODO: surface this to the consumer
  const routesWithErrors: InvalidRouteError[] = []; // TODO: surface this to the consumer

  const routes = paths
    .map((p) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const routeMap: RouteFile = require(p) as RouteFile;
      if (!routeMap || !routeMap.routes) {
        pathsWithErrors.push(p);
        return [];
      }

      return attachRouteMeta(routeMap.routes, routeMap.meta);
    })
    .reduce((a, c) => [...a, ...c], [])
    .map((r) => {
      const errors = checkRouteForErrors(r);
      if (errors) {
        routesWithErrors.push(...errors);
        return null;
      }

      const route = {
        ...r,
        path: normalizePath(r.path, opts.base),
        method: normalizeMethod(r.method),
      };
      return route;
    })
    .filter((r) => r) as Route[];

  return routes;
}

function attachRouteMeta(routes: RouteFile['routes'], meta?: RouteFile['meta']) {
  const _routes = cloneDeep(routes);

  if (!meta) return _routes;
  const middlewares = meta.middlewares;

  if (meta.base) {
    const basePath = meta.base;
    _routes.forEach((r) => {
      r.path = removeDuplicateAndTrailingSlash(`/${basePath}/${r.path}`);
    });
  }

  if (middlewares?.length) {
    _routes.forEach((r) => {
      if (r.middlewares) {
        r.middlewares = [...middlewares, ...r.middlewares];
      } else {
        r.middlewares = [...middlewares];
      }
    });
  }

  return _routes;
}

function removeDuplicateAndTrailingSlash(path: string) {
  const withoutDupe = path.replace(/\/\/+/gi, '/');
  const withoutTrailing = withoutDupe === '1' ? withoutDupe : withoutDupe.replace(/\/$/g, '');
  return withoutTrailing;
}

function removeSpaces(path: string) {
  return path.replace(/\s/gi, '');
}

function normalizePath(path: string, base?: string) {
  let normalizedPath: string = path;

  if (!normalizedPath) {
    normalizedPath = '/';
  }

  if (base) {
    normalizedPath = `${base}/${normalizedPath}`;
  }

  if (!normalizedPath.startsWith('/')) {
    normalizedPath = `/${normalizedPath}`;
  }

  return removeDuplicateAndTrailingSlash(removeSpaces(normalizedPath));
}

function normalizeMethod(method: Route['method']) {
  return method.toUpperCase() as Route['method'];
}

function checkRouteForErrors(route: Route): InvalidRouteError[] | null {
  const errors: InvalidRouteError[] = [];
  if (!isValidMethod(route.method)) {
    errors.push(new InvalidRouteError('invalid method', route.path, route.method));
  }

  if (!route.path || typeof route.path !== 'string' || !route.path.trim()) {
    errors.push(new InvalidRouteError('invalid path', route.path, route.method));
  }

  if (!route.handler || typeof route.handler !== 'function') {
    errors.push(new InvalidRouteError('invalid handler', route.path, route.method));
  }

  return errors.length ? errors : null;
}

function isValidMethod(method: Route['method']): boolean {
  return Object.keys(HttpMethod).includes(method.toUpperCase());
}
