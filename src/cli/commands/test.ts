import {Options} from 'yargs';
import Env from '../../env';
import Tasks from '../../tasks';
import loadWorkspace from '../../workspace';
import runJest from '../../tools/jest';

export const command = 'test';

export const builder: {[key: string]: Options} = {
  watch: {
    type: 'boolean',
    default: true,
  },
};

export interface Argv {
  watch: boolean,
}

export async function handler(argv: Argv) {
  const tasks = new Tasks();
  const workspace = await loadWorkspace(new Env({mode: 'test'}));
  return runJest(workspace, argv, tasks);
}
