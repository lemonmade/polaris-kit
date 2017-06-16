import * as path from 'path';

import {Plugin} from '../types';
import * as plugins from '../plugins';
import Env from '../env';

export interface Config {
  name: string,
  plugins: Plugin[],
}

export default async function loadConfig(root: string, env: Env): Promise<Config> {
  const userConfigurer = require(path.join(root, 'polaris.config'));
  const config = await userConfigurer(plugins, env);
  return {
    name: path.basename(root),
    plugins: [],
    ...config,
  };
}
