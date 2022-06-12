import { RouteFile } from './types';

export function gatherRoutes(paths: string[]) {
  const pathsWithErrors: string[] = [];

  const routes = paths
    .map((p) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const routeMap: RouteFile = require(p) as RouteFile;
      if (!routeMap) {
        pathsWithErrors.push(p);
        return [];
      }

      return attachRouteMeta(routeMap.routes, routeMap.meta);
    })
    .reduce((a, c) => [...a, ...c], []);

  return routes;
}

function attachRouteMeta(routes: RouteFile['routes'], meta?: RouteFile['meta']) {
  if (!meta) return routes;

  if (meta.base) {
    const basePath = meta.base;
    routes.forEach((r) => {
      r.path = removeDoubleSlashes(`/${basePath}/${r.path}`);
    });
  }

  return routes;
}

function removeDoubleSlashes(path: string) {
  return path.replace(/\/\/+/gi, '/');
}
