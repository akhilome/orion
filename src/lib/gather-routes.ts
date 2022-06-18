import { RouteFile } from './types';

export function gatherRoutes(paths: string[]) {
  const pathsWithErrors: string[] = [];

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
    .map((r) => ({ ...r, path: normalizePath(r.path) }));

  return routes;
}

function attachRouteMeta(routes: RouteFile['routes'], meta?: RouteFile['meta']) {
  if (!meta) return routes;
  const middlewares = meta.middlewares;

  if (meta.base) {
    const basePath = meta.base;
    routes.forEach((r) => {
      r.path = removeDuplicateSlashes(`/${basePath}/${r.path}`);
    });
  }

  if (middlewares?.length) {
    routes.forEach((r) => {
      if (r.middlewares) {
        r.middlewares = [...middlewares, ...r.middlewares];
      } else {
        r.middlewares = [...middlewares];
      }
    });
  }

  return routes;
}

function removeDuplicateSlashes(path: string) {
  return path.replace(/\/\/+/gi, '/');
}

function normalizePath(path: string) {
  let normalizedPath: string = path;

  if (!normalizedPath) {
    normalizedPath = '/';
  }

  if (!normalizedPath.startsWith('/')) {
    normalizedPath = `/${path}`;
  }

  return removeDuplicateSlashes(normalizedPath);
}
