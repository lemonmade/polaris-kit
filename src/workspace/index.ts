import * as path from 'path';
import {readJSON} from 'fs-extra';

import {Plugin, PluginMap} from '../types';
import * as plugins from '../plugins';
import Env from '../env';

interface Config {
  name: string,
  plugins: Plugin[],
}

export class Workspace {
  ownRoot = path.resolve(__dirname, '..');

  get name() {
    return this.config.name;
  }

  get usesTypeScript() {
    return this.hasDevDependency('typescript');
  }

  get usesPolaris() {
    return this.hasDependency('@shopify/polaris');
  }

  get usesReact() {
    return this.hasDependency('react');
  }

  get nodeModules() {
    return path.join(this.root, 'node_modules');
  }

  constructor(
    public root: string,
    public env: Env,
    private packageJSON: PackageJSON,
    private config: Config,
  ) {}

  configFor<T extends keyof PluginMap>(plugin: T): PluginMap[T] | undefined {
    return this.config.plugins.find(({plugin: aPlugin}) => aPlugin === plugin);
  }

  uses(dependency: string, versionCondition?: RegExp) {
    return this.hasDependency(dependency, versionCondition) || this.hasDevDependency(dependency, versionCondition);
  }

  hasDependency(dependency: string, versionCondition?: RegExp) {
    const version = this.packageJSON.dependencies[dependency];
    if (version == null) { return false; }
    return versionCondition == null || versionCondition.test(version);
  }

  hasDevDependency(dependency: string, versionCondition?: RegExp) {
    const version = this.packageJSON.devDependencies[dependency];
    if (version == null) { return false; }
    return versionCondition == null || versionCondition.test(version);
  }
}

export default async function loadWorkspace(env = new Env({target: 'client', mode: 'development'})) {
  const root = process.cwd();
  const [config, packageJSON] = await Promise.all([
    loadConfig(root, env),
    loadPackageJSON(root)
  ]);
  
  return new Workspace(root, env, packageJSON, config);
}

async function loadConfig(root: string, env: Env): Promise<Config> {
  const userConfigurer = require(path.join(root, 'polaris.config.ts')).default;
  const config = await userConfigurer(plugins, env);
  return {
    name: path.basename(root),
    plugins: [],
    ...config,
  };
}

interface PackageJSON {
  dependencies: {
    [key: string]: string,
  },
  devDependencies: {
    [key: string]: string,
  },
}

async function loadPackageJSON(root: string): Promise<PackageJSON> {
  return {
    dependencies: {},
    devDependencies: {},
    ...(await readJSON(path.join(root, 'package.json'))),
  };
}
