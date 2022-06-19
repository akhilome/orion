import { Route } from '../src';

export const routes: Route[] = [
  {
    path: 'path-1',
    method: 'GET',
    handler: (_, res) => res.json({ message: 'first path' }),
  },
  {
    path: 'mw-path-1',
    method: 'GET',
    handler: (req, res) => res.json({ message: 'mw path', mw_data: req.headers.from_mw }),
    middlewares: [
      (req, _, next) => {
        req.headers.from_mw = 'from middleware';
        next();
      },
    ],
  },
];
