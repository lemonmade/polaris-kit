import {join} from 'path';
import {execSync} from 'child_process';

import Runner from '../../runner';
import {Workspace} from '../../workspace';
import runGraphQLTypeScriptDefinitions from '../graphql-typescript-definitions';

const TASK = Symbol('TypeScript');

export default async function runStylelint(workspace: Workspace, runner: Runner) {
  if (
    !workspace.project.usesTypeScript ||
    runner.hasPerformed(TASK)
  ) { return; }

  runner.perform(TASK);

  if (workspace.project.usesGraphQL) {
    await runGraphQLTypeScriptDefinitions(workspace, runner);
  }

  const executable = join(workspace.paths.nodeModules, '.bin/tsc');

  try {
    execSync(`${JSON.stringify(executable)} --noEmit`, {stdio: 'inherit'});
  } catch (error) {
    process.exit(1);
  }
}
