import fg from 'fast-glob';
import { Application } from 'express';
import { generateRouter } from './route-generator';
import { gatherRoutes } from './gather-routes';

export interface OrionOptions {
  ext?: 'js' | 'ts';
  suffix?: string;
}

export async function orion(app: Application, opts: OrionOptions) {
  const suffix = opts.suffix || 'route';
  const ext = opts.ext || 'ts';

  const paths = await fg([`./**/*.${suffix}.${ext}`], { absolute: true });
  const routes = gatherRoutes(paths);
  const router = generateRouter(routes);

  app.use(router);

  return app;
}
