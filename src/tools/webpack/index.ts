import {Workspace} from '../../workspace';
import {sass} from './loaders';

export default function webpack(workspace: Workspace) {
  const config = {
    module: {
      loaders: [
        sass(workspace),
      ],
    },
  };

  const webpackConfig = workspace.configFor('webpack');
  return webpackConfig
    ? webpackConfig.configure(config)
    : config;
}
