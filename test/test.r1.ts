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
  {
    path: 'path-sync-error',
    method: 'GET',
    handler: (_, res) => {
      throw new Error('path sync error');
      res.send('never');
    },
  },
  {
    path: 'path-async-error',
    method: 'GET',
    handler: async (_, res) => {
      await Promise.reject(new Error('path async error'));
      res.send('never');
    },
  },
];
