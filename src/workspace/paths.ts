import * as path from 'path';
import {Project} from './project';

export interface Paths {
  ownRoot: string,
  ownNodeModules: string,
  root: string,
  nodeModules: string,
  app: string,
  components: string,
  sections: string,
}

export default async function loadPaths(root: string, project: Project): Promise<Paths> {
  const ownRoot = path.resolve(__dirname, '../..');
  const appPath = project.isNode ? path.join(root, 'app') : path.join(root, 'app/ui');

  return {
    ownRoot,
    ownNodeModules: path.join(ownRoot, 'node_modules'),
    root,
    nodeModules: path.join(root, 'node_modules'),
    app: appPath,
    components: path.join(appPath, 'components'),
    sections: path.join(appPath, 'sections'),
  };
}
