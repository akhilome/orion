import fs from 'fs';
import path from 'path';
import { PackageJson } from 'type-fest';
import { OrionOptions } from './orion';

export function validatePeerDeps(options: OrionOptions): void {
  const { error: logError } = console;
  const missingDeps: string[] = [];
  try {
    const f = fs.readFileSync(path.join(process.cwd(), 'package.json'), { encoding: 'utf-8' });
    const pkg = JSON.parse(f) as PackageJson;

    const hasJoi = Boolean(pkg.dependencies?.joi);

    if (options.validation?.enable && !hasJoi) {
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
