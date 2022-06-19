import chalk from 'chalk';
import { EOL } from 'os';
import { OrionOptions, Route } from './types';

const pad = (str: string) => ` ${str} `;
const { log } = console;

export function routeLogger(routes: Route[], opts: OrionOptions['logging'] = {}) {
  if (!opts.enable) return;

  log(`${EOL}✨ orion mapped routes ${EOL}`);
  routes.forEach(logRoute);
}

function logRoute(route: Route): void {
  const pathColorMap = {
    GET: chalk.bgGreen,
    POST: chalk.bgBlue,
    PUT: chalk.bgMagenta,
    PATCH: chalk.bgYellow,
    DELETE: chalk.bgRed,
    ALL: chalk.bgGray,
  };
  const method = route.method;
  const prettyMethod = pad(method.toUpperCase());
  const prettyPath = pad(route.path);

  log(`${pathColorMap[method].bold(prettyMethod)}${chalk.gray(prettyPath)}${EOL}`);
}
