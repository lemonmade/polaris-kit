import {join} from 'path';
import {readJSON, readFile, pathExists} from 'fs-extra';
import {safeLoad} from 'js-yaml';
import get = require('lodash/get');

export interface PackageJSON {
  dependencies: {
    [key: string]: string,
  },
  devDependencies: {
    [key: string]: string,
  },
}

export interface DevYaml {

}

export class Project {
  get isNode() {
    return !this.isRails;
  }
  
  get usesGraphQL() {
    return this.hasDependency('graphql-tag');
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

  constructor(
    public isRails: boolean,
    private packageJSON: PackageJSON,
    private devYaml: DevYaml,
  ) {}

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

  getDevKey<T>(keyPath: string): T | undefined {
    return get(this.devYaml, keyPath) as T | undefined;
  }
}

export default async function loadProject(root: string): Promise<Project> {
  const devPath = join(root, 'dev.yml');
  const devYaml: DevYaml = await pathExists(devPath)
    ? safeLoad(await readFile(devPath, 'utf8'))
    : {};
  
  const packageJSON = {
    dependencies: {},
    devDependencies: {},
    ...(await readJSON(join(root, 'package.json'))),
  };

  const isRails = await pathExists(join(root, 'Gemfile'));
  
  return new Project(isRails, packageJSON, devYaml);
}
