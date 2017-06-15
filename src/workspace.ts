import * as path from 'path';

import {Plugin, PluginMap} from './types';
import * as plugins from './plugins';
import Env from './env';

interface Config {
  name: string,
  plugins: Plugin[],
}

export class Workspace {
  get name() {
    return this.config.name;
  }

  constructor(public root: string, public env: Env, private config: Config) {}

  configFor<T extends keyof PluginMap>(plugin: T): PluginMap[T] | undefined {
    return this.config.plugins.find(({plugin: aPlugin}) => aPlugin === plugin);
  }
}

export default async function loadWorkspace() {
  const root = process.cwd();
  const env = new Env({target: 'client', mode: 'development'});
  const config = await loadConfig(root, env);
  return new Workspace(root, env, config);
}

async function loadConfig(root: string, env: Env): Promise<Config> {
  const userConfigurer = require(path.join(root, 'polaris.config.ts')).default;
  const config = await userConfigurer(plugins, env);
  return {
    name: path.basename(root),
    tools: [],
    ...config,
  };
}
