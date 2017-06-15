import {Workspace} from '../../workspace';

export function sass(workspace: Workspace) {
  const config = workspace.configFor('Sass');

  return {
    loader: 'sass-loader',
    options: {
      includePaths: config && config.includePaths,
    },
  };
}
