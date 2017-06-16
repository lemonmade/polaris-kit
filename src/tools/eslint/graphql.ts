import {join} from 'path';
import {execSync} from 'child_process';
import {mkdirp, writeFile} from 'fs-extra';

import {Workspace} from '../../workspace';
import buildGraphQL from '../graphql';
import {graphQLSchemaPath, graphQLDirectoryGlobPattern} from '../utilities';

export default async function runGraphQLLint(workspace: Workspace) {
  if (!workspace.project.usesGraphQL) { return; }
  await buildGraphQL(workspace);

  const {paths} = workspace;
  const executable = join(paths.ownNodeModules, '.bin/eslint');
  const configPath = join(paths.private, 'eslint-graphql.config.js');
  
  await mkdirp(paths.private);
  await writeFile(configPath, `
    module.exports = {
      parserOptions: {ecmaVersion: 6},
      plugins: ['graphql'],
      rules: {
        'graphql/template-strings': ['error', {
          env: 'literal',
          schemaJsonFilepath: ${JSON.stringify(graphQLSchemaPath(workspace))},
        }],
      },
    };
  `);

  try {
    execSync(`${JSON.stringify(executable)} ${JSON.stringify(graphQLDirectoryGlobPattern(workspace))} --max-warnings 0 --config ${JSON.stringify(configPath)} --ext '.graphql'`, {stdio: 'inherit'});
  } catch (error) {
    process.exit(1);
  }
}
