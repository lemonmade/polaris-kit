import {execSync} from 'child_process';
import {join} from 'path';
import {pathExists, writeFile, mkdirp} from 'fs-extra';

import Runner from '../../runner';
import {Workspace} from '../../workspace';
import {flatten} from '../../utilities';

const TASK = Symbol('TSLint');

export default async function runTSLint(workspace: Workspace, runner: Runner) {
  if (
    !workspace.project.usesTypeScript ||
    runner.hasPerformed(TASK)
  ) { return; }

  runner.perform(TASK);

  const executable = join(workspace.paths.ownNodeModules, '.bin/tslint');
  const projectTSLintFile = join(workspace.paths.root, 'tslint.json');
  const runTSLintFile = join(workspace.paths.private, 'tsconfig.json');

  const config = {
    extends: flatten([
      await pathExists(projectTSLintFile)
        ? projectTSLintFile
        : [
          'tslint-config-shopify',
          workspace.project.usesReact && 'tslint-config-shopify/react',
        ],
      'tslint-config-shopify/typed',
    ]),
  };

  await mkdirp(workspace.paths.private);
  await writeFile(runTSLintFile, JSON.stringify(config, null, 2));

  try {
    execSync(
      `${JSON.stringify(executable)} './**/*.{ts,tsx}' --config ${JSON.stringify(runTSLintFile)} --exclude './**/node_modules/**/*.{ts,tsx}' --project tsconfig.json --type-check`,
      {stdio: 'inherit'},
    );
  } catch (error) {
    process.exit(1);
  }
}
