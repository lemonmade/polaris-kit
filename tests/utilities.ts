import * as path from 'path';

import {Workspace, Project} from '../src/workspace';
import Env from '../src/env';
import {Plugin} from '../src/types';

interface Options {
  dependencies: {[key: string]: string},
  devDependencies: {[key: string]: string},
  plugins: Plugin[],
  env: Env,
}

export function createWorkspace({
  dependencies = {},
  devDependencies = {},
  plugins = [],
  env = new Env({target: 'client', mode: 'development'}),
}: Partial<Options> = {}) {
  const root = process.cwd();
  const project = new Project({dependencies, devDependencies})
  const config = {name: path.basename(root), plugins};
  return new Workspace(root, env, project, config);
}
