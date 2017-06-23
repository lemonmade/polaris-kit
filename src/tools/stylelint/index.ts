import {join} from 'path';
import {execSync} from 'child_process';

import Runner from '../../runner';
import {Workspace} from '../../workspace';

const TASK = Symbol('Stylelint');

export default async function runStylelint(workspace: Workspace, runner: Runner) {
  if (runner.hasPerformed(TASK)) { return; }
  runner.perform(TASK);

  const executable = join(workspace.paths.ownNodeModules, '.bin/stylelint');

  try {
    execSync(`${JSON.stringify(executable)} './**/*.scss'`, {stdio: 'inherit'});
  } catch (error) {
    process.exit(1);
  }
}
