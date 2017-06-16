import Env from '../../env';
import Tasks from '../../tasks';
import loadWorkspace from '../../workspace';
import runTypeScript from '../../tools/typescript';

export const command = 'type-check';

export async function handler() {
  const tasks = new Tasks();
  const workspace = await loadWorkspace(new Env({mode: 'test'}));
  return runTypeScript(workspace, tasks);
}
