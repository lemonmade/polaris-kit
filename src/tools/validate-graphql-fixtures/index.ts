import {execSync} from 'child_process';
import {join} from 'path';

import {Workspace} from '../../workspace';
import buildGraphQL from '../graphql';
import {graphQLDirectoryGlobPattern, graphQLSchemaPath} from '../utilities';

export default async function validateGraphQLFixtures(workspace: Workspace) {
  if (!workspace.project.usesGraphQL) { return; }
  await buildGraphQL(workspace);

  const {paths} = workspace;
  const executable = join(paths.ownNodeModules, '.bin/graphql-validate-fixtures');
  const pathPrefix = graphQLDirectoryGlobPattern(workspace);

  try {
    execSync(
      `
        ${JSON.stringify(executable)}
        ${JSON.stringify(join(pathPrefix, '**/*Query/*.json'))}
        --operation-paths ${JSON.stringify(join(pathPrefix, '**/*.graphql'))}
        --schema-path ${JSON.stringify(graphQLSchemaPath(workspace))}
      `.replace(/\n/g, ' ').trim(),
      {stdio: 'inherit'},
    );
  } catch (error) {
    process.exit(1);
  }
}
