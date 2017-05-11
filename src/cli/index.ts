import * as yargs from 'yargs';
import * as build from './commands/build';
import * as showConfig from './commands/show-config';

yargs
  .usage('Usage: $0 [command] [options]')
  .command(build)
  .command(showConfig)
  .help()
  .argv;
