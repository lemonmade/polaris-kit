
import loadWorkspace from '../../workspace';
import {webpack} from '../../tools';

export const command = 'show-config';

export async function handler() {
  const workspace = await loadWorkspace();
  console.log(JSON.stringify(workspace, null, 2));
  console.log(JSON.stringify(webpack(workspace), null, 2));
}
