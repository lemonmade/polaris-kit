import * as path from 'path';

import {Workspace, Project} from '../src/workspace';
import Env from '../src/env';
import {Plugin} from '../src/types';

export interface Options {
  root: string,
  isRails: boolean,
  dependencies: {[key: string]: string},
  devDependencies: {[key: string]: string},
  devYaml: {[key: string]: any},
  plugins: Plugin[],
  env: Env,
}

export function createWorkspace({
  root = process.cwd(),
  isRails = false,
  dependencies = {},
  devDependencies = {},
  devYaml = {},
  plugins = [],
  env = new Env({target: 'client', mode: 'development'}),
}: Partial<Options> = {}) {
  const project = new Project(isRails, {dependencies, devDependencies}, devYaml)
  const config = {name: path.basename(root), plugins};
  const appPath = isRails ? path.join(root, 'app/ui') : path.join(root, 'app');
  const paths = {
    ownRoot: path.resolve(__dirname, '..'),
    ownNodeModules: path.resolve(__dirname, '../node_modules'),
    root,
    private: path.join(root, '.sewing-kit'),
    build: path.join(root, 'build'),
    packages: path.join(root, 'packages'),
    nodeModules: path.join(root, 'node_modules'),
    app: appPath,
    components: path.join(appPath, 'components'),
    sections: path.join(appPath, 'sections'),
  };
  return new Workspace(root, env, project, paths, config);
}

const DEFAULT_VERSIONS = {
  react: '15.0.0',
  typescript: '2.0.0',
  '@shopify/polaris': '1.0.0',
};

export function createDependency(name: string, version = '1.0.0') {
  return {
    [name]: DEFAULT_VERSIONS.hasOwnProperty(name)
      ? DEFAULT_VERSIONS[name as keyof typeof DEFAULT_VERSIONS]
      : version,
  };
}
