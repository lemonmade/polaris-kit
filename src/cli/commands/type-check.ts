import Env from '../../env';
import Runner from '../../runner';
import loadWorkspace from '../../workspace';
import runTypeScript from '../../tools/typescript';

export const command = 'type-check';

export async function handler() {
  const runner = new Runner();
  const workspace = await loadWorkspace(new Env({mode: 'test'}));
  return runTypeScript(workspace, runner);
}
