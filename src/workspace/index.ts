import * as path from 'path';

import {PluginMap} from '../types';
import Env from '../env';

import loadConfig, {Config} from './config';
import loadProject, {Project} from './project';

export {Config, Project};

export class Workspace {
  ownRoot = path.resolve(__dirname, '..', '..');

  get name() {
    return this.config.name;
  }

  get nodeModules() {
    return path.join(this.root, 'node_modules');
  }

  constructor(
    public root: string,
    public env: Env,
    public project: Project,
    private config: Config,
  ) {}

  configFor<T extends keyof PluginMap>(plugin: T): PluginMap[T] | undefined {
    return this.config.plugins.find(({plugin: aPlugin}) => aPlugin === plugin);
  }
}

export default async function loadWorkspace(env = new Env({target: 'client', mode: 'development'})) {
  const root = process.cwd();
  const [config, project] = await Promise.all([
    loadConfig(root, env),
    loadProject(root)
  ]);
  
  return new Workspace(root, env, project, config);
}
