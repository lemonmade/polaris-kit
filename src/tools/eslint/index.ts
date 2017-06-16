import {execSync} from 'child_process';
import {join} from 'path';
import Tasks from '../../tasks';
import {Workspace} from '../../workspace';

export {default as runGraphQLLint} from './graphql';

const TASK = Symbol('ESLint');

export default async function runESLint(workspace: Workspace, tasks: Tasks) {
  if (tasks.hasPerformed(TASK)) { return; }
  tasks.perform(TASK);

  const executable = join(workspace.paths.ownNodeModules, '.bin/eslint');

  try {
    execSync(`${JSON.stringify(executable)} . --max-warnings 0`, {stdio: 'inherit'});
  } catch (error) {
    process.exit(1);
  }
}
