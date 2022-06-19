import express, { Application } from 'express';
import request from 'supertest';
import { orion } from '../src';

let bareApp: Application;
beforeAll(() => {
  bareApp = express();
});

const defaultOptions = { validation: { enable: false }, logging: { enable: false } };

describe('config', () => {
  it('should throw when validation enabled but no joi dep.', () => {
    try {
      orion(bareApp);
    } catch (e) {
      const error = e as Error;
      expect(error).toBeDefined();
      expect(error.message).toEqual('[orion]: missing required dependencies - joi');
    }
  });

  it('should not throw when no validation enabled and no joi dep.', () => {
    try {
      orion(bareApp, { ...defaultOptions });
    } catch (e) {
      const error = e as Error;
      expect(error).toBeUndefined();
    }
  });

  it('should look for different suffix when supplied', async () => {
    const app = orion(bareApp, { ...defaultOptions, suffix: 'juls' });
    const res = await request(app).get('/juls-1');
    const body = res.body as Record<string, unknown>;

    expect(body).toBeDefined();
    expect(body.message).toEqual('different suffix');
  });

  it('should log to console when logging enabled', () => {
    const { Console } = console;
    const spy = jest.spyOn(Console.prototype, 'log');
    orion(bareApp, { ...defaultOptions, logging: { enable: true } });

    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0].join('')).toMatch(/.*orion\smapped\sroutes.*/);
  });
});

describe('mapped paths', () => {
  it('should map paths correctly', async () => {
    const app = orion(bareApp, { ...defaultOptions });

    const res = await request(app).get('/path-1');
    const body = res.body as Record<string, unknown>;

    expect(body).toBeDefined();
    expect(body.message).toEqual('first path');
  });

  it('should skip paths with incorrect schema', async () => {
    const app = orion(bareApp, { ...defaultOptions });

    const res = await request(app).get('/lol-route');

    expect(res.statusCode).toEqual(404);
  });
});

describe('middlewares', () => {
  it('should correctly use middleware', async () => {
    const app = orion(bareApp, { ...defaultOptions });

    const res = await request(app).get('/mw-path-1');
    const body = res.body as Record<string, unknown>;

    expect(body).toBeDefined();
    expect(body.message).toEqual('mw path');
    expect(body.mw_data).toEqual('from middleware');
  });
});

describe('routes meta', () => {
  it('should correctly attach base path', async () => {
    const app = orion(bareApp, { ...defaultOptions });

    const res = await request(app).get('/test/path-1');
    const body = res.body as Record<string, unknown>;

    expect(body).toBeDefined();
    expect(body.message).toEqual('meta path 1');
  });

  it('should correctly use meta middlewares', async () => {
    const app = orion(bareApp, { ...defaultOptions });

    const res = await request(app).get('/test/path-2');
    const body = res.body as Record<string, unknown>;

    expect(body).toBeDefined();
    expect(body.message).toEqual('meta path 1');
    expect(body.from_mw).toEqual('from meta middleware');
  });
});
