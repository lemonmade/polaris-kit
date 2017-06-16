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

const DEFAULT_VERSIONS = {
  react: '15.0.0',
  typescript: '2.0.0',
  '@shopify/polaris': '1.0.0',
};

export function createDependency(name: string) {
  return {
    [name]: DEFAULT_VERSIONS.hasOwnProperty(name)
      ? DEFAULT_VERSIONS[name as keyof typeof DEFAULT_VERSIONS]
      : '1.0.0',
  };
}
