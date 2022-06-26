import chalk from 'chalk';
import { EOL } from 'os';
import { OrionOptions, Route } from './types';

const pad = (str: string) => ` ${str} `;
const { log } = console;

type RouteLoggerOptions = {
  suffix: string;
  ext: string;
} & OrionOptions['logging'];

export function routeLogger(routes: Route[], opts: RouteLoggerOptions) {
  if (!opts.enable) return;

  log(`${EOL}✨ [*.${opts.suffix}.${opts.ext}] ::: mapped routes ${EOL}`);
  routes.forEach(logRoute);
}

function logRoute(route: Route): void {
  let coloredChalk: chalk.Chalk;
  switch (route.method) {
    case 'GET':
      coloredChalk = chalk.bgGreen;
      break;
    case 'POST':
      coloredChalk = chalk.bgBlue;
      break;
    case 'PUT':
      coloredChalk = chalk.bgMagenta;
      break;
    case 'PATCH':
      coloredChalk = chalk.bgYellow;
      break;
    case 'DELETE':
      coloredChalk = chalk.bgRed;
      break;
    default:
      coloredChalk = chalk.bgGray;
      break;
  }

  const prettyMethod = pad(route.method);
  const prettyPath = pad(route.path);

  log(`${coloredChalk.bold(prettyMethod)}${chalk.gray(prettyPath)}${EOL}`);
}
