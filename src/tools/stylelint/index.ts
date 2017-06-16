import {join} from 'path';
import {execSync} from 'child_process';

import Tasks from '../../tasks';
import {Workspace} from '../../workspace';

const TASK = Symbol('Stylelint');

export default async function runStylelint(workspace: Workspace, tasks: Tasks) {
  if (tasks.hasPerformed(TASK)) { return; }
  tasks.perform(TASK);

  const executable = join(workspace.paths.ownNodeModules, '.bin/stylelint');

  try {
    execSync(`${JSON.stringify(executable)} './**/*.scss'`, {stdio: 'inherit'});
  } catch (error) {
    process.exit(1);
  }
}
