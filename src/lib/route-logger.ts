import chalk from 'chalk';
import { EOL } from 'os';
import { OrionOptions } from './orion';
import { Route } from './types';

const pad = (str: string) => ` ${str} `;
const { log } = console;

export function routeLogger(routes: Route[], opts: OrionOptions['logging'] = {}) {
  if (opts.supress) return;

  log(`${EOL}✨ orion mapped routes ${EOL}`);
  routes.forEach(logRoute);
}

function logRoute(route: Route): void {
  const pathColorMap = {
    get: chalk.bgGreen,
    post: chalk.bgBlue,
    put: chalk.bgMagenta,
    patch: chalk.bgYellow,
    delete: chalk.bgRed,
    all: chalk.bgGray,
  };
  const method = route.method;
  const prettyMethod = pad(method.toUpperCase());
  const prettyPath = pad(route.path);

  log(`${pathColorMap[method].bold(prettyMethod)}${chalk.gray(prettyPath)}${EOL}`);
}
