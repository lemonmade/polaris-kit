import * as path from 'path';
import * as tools from './configure';
import Env from './env';

interface Config {
  name: string,
  tools: tools.ToolConfig[],
}

export class Workspace {
  get name() {
    return this.config.name;
  }

  constructor(public root: string, public env: Env, private config: Config) {}

  configFor<T extends keyof tools.ConfigMap>(tool: T): tools.ConfigMap[T] | undefined {
    return this.config.tools.find(({tool: aTool}) => aTool === tool);
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
  const config = await userConfigurer(tools, env);
  return {
    name: path.basename(root),
    tools: [],
    ...config,
  };
}
