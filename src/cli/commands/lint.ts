import {Options} from 'yargs';
import Env from '../../env';
import loadWorkspace from '../../workspace';
import runGraphQLFixtureLint from '../../tools/validate-graphql-fixtures';

export const command = 'lint';

export const builder: {[key: string]: Options} = {
  'graphql-fixtures': {
    type: 'boolean',
    default: true,
  },
};

export interface Argv {
  graphqlFixtures: boolean,
}

export async function handler(argv: Argv) {
  const workspace = await loadWorkspace(new Env({mode: 'test'}));

  if (argv.graphqlFixtures) {
    runGraphQLFixtureLint(workspace);
  }
}
