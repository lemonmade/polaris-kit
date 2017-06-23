import * as path from 'path';

import {Plugin, PluginMap} from '../types';
import * as allPlugins from '../plugins';
import Env from '../env';

export interface UserConfigurer {
  (plugins: typeof allPlugins, env: Env): {name?: string, plugins?: Plugin[]},
}

export class Config {
  constructor(public name: string, public plugins: Plugin[] = []) {}

  for<T extends keyof PluginMap>(plugin: T): PluginMap[T] | undefined {
    return this.plugins.find(({plugin: aPlugin}) => aPlugin === plugin);
  }
}

export default async function loadConfig(root: string, env: Env): Promise<Config> {
  const userConfigurer: UserConfigurer = require(path.join(root, 'polaris.config'));
  const {name, plugins} = await userConfigurer(allPlugins, env);
  return new Config(name || path.basename(root), plugins);
}
