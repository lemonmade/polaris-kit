import * as yargs from 'yargs';

import * as test from './commands/test';
import * as lint from './commands/lint';
import * as generate from './commands/generate';

yargs
  .usage('Usage: $0 [command] [options]')
  .command(test)
  .command(lint)
  .command(generate)
  .help()
  .argv;
