import Env from './env';
import Configure from './configure';
import {ToolConfig, ConfigMap, Tool} from './types';
import webpack from './build/webpack';
import rollup from './build/rollup';

import createConfig from '../polaris.config';

export class UserConfig {
  constructor(private toolConfig: ToolConfig[]) {}

  configForTool<T extends Tool>(tool: T): ConfigMap[T] | undefined {
    return this.toolConfig.find(({tool: aTool}) => aTool === tool);
  }
}

export class Config {
  constructor(private env: Env, private userConfig: UserConfig) {}

  get webpack() {
    return webpack(this.env, this.userConfig);
  }

  get rollup() {
    return rollup(this.env, this.userConfig);
  }
}

export default function loadConfig(env: Env) {
  const configure = new Configure();
  // Here we would load the config before actually calling it
  return new Config(env, new UserConfig(createConfig(configure, env)));
}
