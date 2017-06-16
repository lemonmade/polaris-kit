import {Options} from 'yargs';

import Env from '../../env';
import loadWorkspace from '../../workspace';

import {runGraphQLLint} from '../../tools/eslint';
import runGraphQLFixtureLint from '../../tools/validate-graphql-fixtures';

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
};

export interface Argv {
  graphql: boolean,
  graphqlFixtures: boolean,
}

export async function handler(argv: Argv) {
  const workspace = await loadWorkspace(new Env({mode: 'test'}));

  if (argv.graphql) {
    await runGraphQLLint(workspace);
  }

  if (argv.graphqlFixtures) {
    await runGraphQLFixtureLint(workspace);
  }
}