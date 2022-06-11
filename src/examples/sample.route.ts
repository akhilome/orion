import { Route, RoutesMeta } from '../lib/types';

export const routes: Route[] = [
  {
    method: 'get',
    path: '/example',
    handler: (_, res) => res.json({ message: 'something huge' }),
  },
];

export const meta: RoutesMeta = {
  base: 'v1',
};
