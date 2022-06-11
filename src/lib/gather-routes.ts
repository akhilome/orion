import path from 'path';
import fg from 'fast-glob';
import { RoutesMeta, Route } from './types';

const ext = path.extname(__filename);
export interface RouteFile {
  routes: Route[];
  meta?: RoutesMeta;
}

export async function gatherRoutes() {
  const paths = await fg([`./**/*.route${ext}`], { absolute: true });
  const pathsWithErrors: string[] = [];
  const routes = paths
    .map((p) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const routeMap: RouteFile = require(p) as RouteFile;

      if (!routeMap) {
        pathsWithErrors.push(p);
        return [];
      }

      return routeMap.routes;
    })
    .reduce((a, c) => [...a, ...c], []);

  return routes;
}
