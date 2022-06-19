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
