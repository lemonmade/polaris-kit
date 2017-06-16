import {join} from 'path';
import {readJSON} from 'fs-extra';

interface PackageJSON {
  dependencies: {
    [key: string]: string,
  },
  devDependencies: {
    [key: string]: string,
  },
}

export class Project {
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

  constructor(private packageJSON: PackageJSON) {}

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

export default async function loadProject(root: string): Promise<Project> {
  return new Project({
    dependencies: {},
    devDependencies: {},
    ...(await readJSON(join(root, 'package.json'))),
  });
}
