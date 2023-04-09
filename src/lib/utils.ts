import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PackageJson } from 'type-fest';
import { OrionOptions, RequestHandler } from './types';

export const defaultOptions = {
  suffix: 'route',
  base: '',
  validation: {
    enabled: true,
    options: { abortEarly: false, stripUnknown: true },
    errorStatusCode: 422,
  },
  logging: {
    enabled: true,
  },
} as const;

export function validatePeerDeps(options: OrionOptions): void {
  const { error: logError } = console;
  const missingDeps: string[] = [];
  try {
    const f = fs.readFileSync(path.join(process.cwd(), 'package.json'), { encoding: 'utf-8' });
    const pkg = JSON.parse(f) as PackageJson;

    const hasJoi = Boolean(pkg.dependencies?.joi);

    if (options.validation?.enabled && !hasJoi) {
      missingDeps.push('joi');
    }
  } catch (error) {
    logError(
      '[orion]: WARN: unable to validate required dependencies for orion; ensure all required peer dependencies are installed.',
    );
  }

  if (missingDeps.length) {
    throw new Error(`[orion]: missing required dependencies - ${missingDeps.join(', ')}`);
  }
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  CONNECT = 'CONNECT',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
  ALL = 'ALL',
}

export class InvalidRouteError extends Error {
  constructor(message: string, public path = 'N/A', public method = 'N/A') {
    super(message);
  }
}

export const handleThrownErrors =
  (handler: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(handler(req, res, next)).catch(next);
  };
