import { Route } from '../src';

export const routes: Route[] = [
  {
    path: '/',
    method: 'GET',
    handler: (_, res) => res.json({ message: 'root base test root' }),
  },
  {
    path: 'path-1',
    method: 'GET',
    handler: (_, res) => res.json({ message: 'root base test' }),
  },
];
