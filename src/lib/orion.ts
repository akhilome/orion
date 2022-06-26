import caller from 'caller';
import fg from 'fast-glob';
import path from 'path';

import { gatherRoutes } from './gather-routes';
import { generateRouter } from './route-generator';
import { routeLogger } from './route-logger';
import { OrionOptions } from './types';
import { defaultOptions, validatePeerDeps } from './utils';

export function orion(opts: OrionOptions = defaultOptions) {
  opts = { ...defaultOptions, ...opts };
  const callSite = caller();
  const callerExt = path.extname(callSite).split('.')[1];
  const suffix = opts.suffix as string;
  const ext = opts.ext || callerExt;

  // ensure required dependencies are installed
  validatePeerDeps(opts);

  const paths = fg.sync([`./**/*.${suffix}.${ext}`], {
    absolute: true,
    cwd: path.dirname(callSite),
  });

  const routes = gatherRoutes(paths);

  routeLogger(routes, { suffix, ext, ...opts.logging });

  const router = generateRouter(routes, opts);

  return router;
}
