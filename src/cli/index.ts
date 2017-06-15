import * as yargs from 'yargs';

import * as showConfig from './commands/show-config';
import * as test from './commands/test';

yargs
  .usage('Usage: $0 [command] [options]')
  .command(showConfig)
  .command(test)
  .help()
  .argv;
