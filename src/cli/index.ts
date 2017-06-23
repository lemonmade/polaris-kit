import * as yargs from 'yargs';

import * as test from './commands/test';
import * as lint from './commands/lint';
import * as typeCheck from './commands/type-check';
import * as generate from './commands/generate';
import * as build from './commands/build';

yargs
  .usage('Usage: $0 [command] [options]')
  .command(test)
  .command(lint)
  .command(build)
  .command(generate)
  .command(typeCheck)
  .help()
  .argv;
