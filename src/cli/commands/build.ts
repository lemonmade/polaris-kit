import {Options as YargsOption} from 'yargs';

import Env from '../../env';
import Tasks from '../../tasks';
import loadWorkspace from '../../workspace';
import runWebpack, {Options} from '../../tools/webpack';

export const command = 'build';

export const builder: {[key: string]: YargsOption} = {
  mode: {
    choices: ['development', 'production'],
    default: 'development',
  },
  report: {
    boolean: true,
    default: false,
  },
  'source-maps': {
    boolean: true,
    default: false,
  },
  'type-check': {
    boolean: true,
    default: true,
  },
};

export interface Argv extends Options {
  mode: 'development' | 'production',
}

export async function handler({mode, ...options}: Argv) {
  const tasks = new Tasks();
  const workspace = await loadWorkspace(new Env({target: 'client', mode}));
  
  try {
    await runWebpack(workspace, options, tasks);

    // TODO: check if server exists
    if (workspace.project.isNode) {
      const serverWorkspace = workspace.duplicate(new Env({target: 'server', mode}))
      await runWebpack(serverWorkspace, options, tasks);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
