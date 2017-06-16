import * as yargs from 'yargs';

import * as test from './commands/test';
import * as generate from './commands/generate';

yargs
  .usage('Usage: $0 [command] [options]')
  .command(test)
  .command(generate)
  .help()
  .argv;
