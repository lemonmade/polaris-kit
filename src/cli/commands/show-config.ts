
import loadWorkspace from '../../workspace';
import {config as webpack} from '../../tools/webpack';

export const command = 'show-config';

export async function handler() {
  const workspace = await loadWorkspace();
  console.log(JSON.stringify(workspace, null, 2));
  console.log(JSON.stringify(webpack(workspace), null, 2));
}
