import path from 'path';
import fg from 'fast-glob';
import { Application } from 'express';
import { RoutesMeta, Route } from './types';
import { generateRouter } from './route-generator';

const ext = path.extname(__filename);

export interface RouteFile {
  routes: Route[];
  meta?: RoutesMeta;
}

async function gatherRoutes() {
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

  console.log('routes -> ', routes);

  return routes;
}

export async function orion(app: Application) {
  const routes = await gatherRoutes();
  const router = generateRouter(routes);

  app.use(router);

  return app;
}
