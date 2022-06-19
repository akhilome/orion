import { Route } from '../src';

export const routes: Route[] = [
  {
    path: 'juls-1',
    method: 'GET',
    handler: (_, res) => res.json({ message: 'different suffix' }),
  },
];
