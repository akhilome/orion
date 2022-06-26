import express, { Application } from 'express';
import request from 'supertest';
import { orion } from '../src';

let app: Application;
beforeEach(() => {
  app = express();
});

const defaultOptions = { validation: { enable: false }, logging: { enable: false } };

describe('config', () => {
  it('should throw when validation enabled but no joi dep.', () => {
    try {
      orion();
    } catch (e) {
      const error = e as Error;
      expect(error).toBeDefined();
      expect(error.message).toEqual('[orion]: missing required dependencies - joi');
    }
  });

  it('should not throw when no validation enabled and no joi dep.', () => {
    try {
      app.use(orion({ ...defaultOptions }));
    } catch (e) {
      const error = e as Error;
      expect(error).toBeUndefined();
    }
  });

  it('should look for different suffix when supplied', async () => {
    app.use(orion({ ...defaultOptions, suffix: 'juls' }));
    const res = await request(app).get('/juls-1');
    const body = res.body as Record<string, unknown>;

    expect(body).toBeDefined();
    expect(body.message).toEqual('different suffix');
  });

  it('should log to console when logging enabled', () => {
    const { Console } = console;
    const spy = jest.spyOn(Console.prototype, 'log');
    app.use(orion({ ...defaultOptions, logging: { enable: true } }));

    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0].join('')).toMatch(/.*:::\smapped\sroutes.*/);
  });
});

describe('mapped paths', () => {
  it('should map paths correctly', async () => {
    app.use(orion({ ...defaultOptions }));

    const res = await request(app).get('/path-1');
    const body = res.body as Record<string, unknown>;

    expect(body).toBeDefined();
    expect(body.message).toEqual('first path');
  });

  it('should skip paths with incorrect schema', async () => {
    app.use(orion({ ...defaultOptions }));

    const res = await request(app).get('/lol-route');

    expect(res.statusCode).toEqual(404);
  });
});

describe('middlewares', () => {
  it('should correctly use middleware', async () => {
    app.use(orion({ ...defaultOptions }));

    const res = await request(app).get('/mw-path-1');
    const body = res.body as Record<string, unknown>;

    expect(body).toBeDefined();
    expect(body.message).toEqual('mw path');
    expect(body.mw_data).toEqual('from middleware');
  });
});

describe('routes meta', () => {
  it('should correctly attach base path', async () => {
    app.use(orion({ ...defaultOptions }));

    const res = await request(app).get('/test/path-1');
    const body = res.body as Record<string, unknown>;

    expect(body).toBeDefined();
    expect(body.message).toEqual('meta path 1');
  });

  it('should correctly use meta middlewares', async () => {
    app.use(orion({ ...defaultOptions }));

    const res = await request(app).get('/test/path-2');
    const body = res.body as Record<string, unknown>;

    expect(body).toBeDefined();
    expect(body.message).toEqual('meta path 1');
    expect(body.from_mw).toEqual('from meta middleware');
  });
});

describe('root base', () => {
  it('should correctly attach root base path', async () => {
    app.use(orion({ ...defaultOptions, base: 'r1', suffix: 'r1' }));

    const res = await request(app).get('/r1');
    const body = res.body as Record<string, unknown>;

    expect(body).toBeDefined();
    expect(body.message).toEqual('root base test root');
  });

  it('should correctly attach root base path route', async () => {
    app.use(orion({ ...defaultOptions, base: 'r1', suffix: 'r1' }));

    const res = await request(app).get('/r1/path-1');
    const body = res.body as Record<string, unknown>;

    expect(body).toBeDefined();
    expect(body.message).toEqual('root base test');
  });
});
