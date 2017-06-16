import {join} from 'path';
import {execSync} from 'child_process';

import Tasks from '../../tasks';
import {Workspace} from '../../workspace';
import runGraphQLTypeScriptDefinitions from '../graphql-typescript-definitions';

const TASK = Symbol('TypeScript');

export default async function runStylelint(workspace: Workspace, tasks: Tasks) {
  if (
    !workspace.project.usesTypeScript ||
    tasks.hasPerformed(TASK)
  ) { return; }

  tasks.perform(TASK);

  if (workspace.project.usesGraphQL) {
    await runGraphQLTypeScriptDefinitions(workspace, tasks);
  }

  const executable = join(workspace.paths.nodeModules, '.bin/tsc');

  try {
    execSync(`${JSON.stringify(executable)} --noEmit`, {stdio: 'inherit'});
  } catch (error) {
    process.exit(1);
  }
}
