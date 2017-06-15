import {Workspace} from '../../workspace';
import {ifElse, flatten, removeNullValues} from '../../utilities';

import resolve from './resolve';
import {sass} from './loaders';

export interface Config {
  [key: string]: any,
}

export default function webpackConfig(workspace: Workspace): Config {
  const {env} = workspace;

  const config = removeNullValues({
    cache: true,
    target: ifElse(env.isServer, 'node', 'web'),
    // We have to set this to be able to use these items when executing a
    // server bundle.  Otherwise strangeness happens, like __dirname resolving
    // to '/'.  There is no effect on our client bundle.
    node: ifElse(env.isServer, {
      __dirname: true,
      __filename: true,
    }),
    module: {
      loaders: flatten([
        sass(workspace),
      ]),
    },
    resolve: resolve(workspace),
  });

  const webpackConfig = workspace.configFor('webpack');
  return webpackConfig
    ? webpackConfig.configure(config)
    : config;
}
