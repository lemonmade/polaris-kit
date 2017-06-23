// graphql-typescript-definitions '{app,server}/**/*.graphql' -- --schema-path 'build/schema.json'

import {execSync} from 'child_process';
import {join} from 'path';

import Runner from '../../runner';
import {Workspace} from '../../workspace';
import buildGraphQL from '../graphql';
import {graphQLDirectoryGlobPattern, graphQLSchemaPath} from '../utilities';

const TASK = Symbol('GraphQLTypeScriptDefinitions');

export default async function validateGraphQLFixtures(workspace: Workspace, runner: Runner) {
  if (
    !workspace.project.usesGraphQL ||
    runner.hasPerformed(TASK)
  ) { return; }

  runner.perform(TASK);
  await buildGraphQL(workspace, runner);

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

