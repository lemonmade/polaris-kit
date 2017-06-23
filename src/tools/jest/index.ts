import Runner from '../../runner';
import {Workspace} from '../../workspace';
import createConfig from './config';

const jest = require('jest');

export interface Options {
  watch: boolean,
}

export {createConfig};

const TASK = Symbol('Jest');

export default async function runJest(
  workspace: Workspace,
  {watch = false}: Partial<Options> = {},
  runner = new Runner(),
) {
  if (runner.hasPerformed(TASK)) { return; }
  runner.perform(TASK);
  // Do this as the first thing so that any code reading it knows the right env.
  process.env.BABEL_ENV = 'test';
  process.env.NODE_ENV = 'test';

  const config = await createConfig(workspace);
  const args = ['--config', JSON.stringify(config)];
  if (workspace.env.isCI) { args.push('--runInBand'); }
  if (watch && !workspace.env.isCI) { args.push('--watch'); }
  return jest.run(args);
}
