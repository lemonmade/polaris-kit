// graphql-typescript-definitions '{app,server}/**/*.graphql' -- --schema-path 'build/schema.json'

import {execSync} from 'child_process';
import {join} from 'path';

import Tasks from '../../tasks';
import {Workspace} from '../../workspace';
import buildGraphQL from '../graphql';
import {graphQLDirectoryGlobPattern, graphQLSchemaPath} from '../utilities';

const TASK = Symbol('GraphQLTypeScriptDefinitions');

export default async function validateGraphQLFixtures(workspace: Workspace, tasks: Tasks) {
  if (
    !workspace.project.usesGraphQL ||
    tasks.hasPerformed(TASK)
  ) { return; }

  tasks.perform(TASK);
  await buildGraphQL(workspace, tasks);

  const {paths} = workspace;
  const executable = join(paths.ownNodeModules, '.bin/graphql-typescript-definitions');
  const pathPrefix = graphQLDirectoryGlobPattern(workspace);

  try {
    execSync(
      `
        ${JSON.stringify(executable)}
        ${JSON.stringify(join(pathPrefix, '**/*.graphql'))}
        --schema-path ${JSON.stringify(graphQLSchemaPath(workspace))}
      `.replace(/\n/g, ' ').trim(),
      {stdio: 'inherit'},
    );
  } catch (error) {
    process.exit(1);
  }
}

