import {execSync} from 'child_process';
import {join, relative} from 'path';
import {Workspace} from '../../workspace';
import buildGraphQL from '../graphql';

export default async function validateGraphQLFixtures(workspace: Workspace) {
  if (!workspace.project.usesGraphQL) { return; }
  await buildGraphQL(workspace);

  const {paths} = workspace;
  const executable = join(paths.ownNodeModules, '.bin/graphql-validate-fixtures');
  // TODO: add client/ server here, if they exist
  const dirs = [relative(paths.root, paths.app)];
  const pathPrefix = dirs.length > 1 ? `{${dirs.join(',')}}` : dirs[0];

  try {
    execSync(
      `
        '${executable}'
        '${join(pathPrefix, '**/*Query/*.json')}'
        --operation-paths '${join(pathPrefix, '**/*.graphql')}'
        --schema-path '${join(paths.build, 'schema.json')}'
      `.replace(/\n/g, ' ').trim(),
      {stdio: 'inherit'},
    );
  } catch (error) {
    process.exit(1);
  }
}
