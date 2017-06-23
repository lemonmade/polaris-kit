import {Options} from 'yargs';

import Env from '../../env';
import Runner from '../../runner';
import loadWorkspace from '../../workspace';

import {runGraphQLLint} from '../../tools/eslint';
import runGraphQLFixtureLint from '../../tools/validate-graphql-fixtures';
import runStylelint from '../../tools/stylelint';
import runESLint from '../../tools/eslint';
import runTSLint from '../../tools/tslint';

export const command = 'lint';

export const builder: {[key: string]: Options} = {
  'graphql-fixtures': {
    boolean: true,
    default: false,
  },
  graphql: {
    boolean: true,
    default: false,
  },
  styles: {
    boolean: true,
    default: false,
  },
  scripts: {
    boolean: true,
    default: true,
  },
};

export interface Argv {
  graphql: boolean,
  graphqlFixtures: boolean,
  styles: boolean,
  scripts: boolean,
}

export async function handler(argv: Argv) {
  const runner = new Runner();
  const workspace = await loadWorkspace(new Env({mode: 'test'}));

  if (argv.graphql) {
    await runGraphQLLint(workspace, runner);
  }

  if (argv.graphqlFixtures) {
    await runGraphQLFixtureLint(workspace, runner);
  }

  if (argv.styles) {
    await runStylelint(workspace, runner);
  }

  if (argv.scripts) {
    await runESLint(workspace, runner);

    if (workspace.project.usesTypeScript) {
      await runTSLint(workspace, runner);
    }
  }
}
