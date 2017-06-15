import * as yargs from 'yargs';
import * as showConfig from './commands/show-config';

yargs
  .usage('Usage: $0 [command] [options]')
  .command(showConfig)
  .help()
  .argv;
