import { Route, RoutesMeta } from '../src';

export const routes: Route[] = [
  {
    method: 'GET',
    path: 'path-1',
    handler: (_, res) => res.json({ message: 'meta path 1' }),
  },
  {
    method: 'GET',
    path: 'path-2',
    handler: (req, res) => res.json({ message: 'meta path 1', from_mw: req.headers.from_mw }),
  },
];

export const meta: RoutesMeta = {
  base: 'test',
  middlewares: [
    (req, _, next) => {
      req.headers.from_mw = 'from meta middleware';
      next();
    },
  ],
};
