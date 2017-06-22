import {join, relative} from 'path';
import {Workspace} from '../workspace';

export function graphQLDirectoryGlobPattern(workspace: Workspace) {
  // TODO: add client/ server here, if they exist
  const dirs = [relative(workspace.paths.root, workspace.paths.app)];
  return dirs.length > 1 ? `{${dirs.join(',')}}` : dirs[0];
}

export function graphQLSchemaPath(workspace: Workspace, idl = false) {
  return join(workspace.paths.build, `schema.${idl ? 'graphql' : 'json'}`);
}
