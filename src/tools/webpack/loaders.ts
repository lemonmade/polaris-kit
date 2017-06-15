import {Workspace} from '../../workspace';

export function sass(workspace: Workspace) {
  const config = workspace.configFor('sass');

  return {
    loader: 'sass-loader',
    options: {
      includePaths: config && config.includePaths,
    },
  };
}
