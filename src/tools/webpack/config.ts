import {Workspace} from '../../workspace';
import {ifElse, flatten, removeNullValues} from '../../utilities';

import resolve from './resolve';
import {sass, images, javascript, typescript, fonts, graphql} from './rules';
import {
  report,
  watch,
  styles,
  manifest,
  input,
  define,
  output,
  typescript as typescriptPlugin,
} from './plugins';

export interface Config {
  [key: string]: any,
}

export interface Options {
  sourceMaps: boolean,
  typeCheck: boolean,
  report: boolean,
}

export default function webpackConfig(
  workspace: Workspace,
  {
    sourceMaps = true,
    typeCheck = true,
    report: buildReport = false,
  }: Partial<Options> = {}
): Config {
  const {env, paths} = workspace;

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
    devtool: ifElse(
      env.isProduction,
      ifElse(env.isServer, 'source-map', 'hidden-source-map'),
      ifElse(sourceMaps, 'source-map', 'eval'),
    ),
    plugins: flatten([
      input(),
      define(workspace),
      watch(workspace),
      styles(workspace),
      ifElse(typeCheck, typescriptPlugin(workspace)),
      ifElse(buildReport, report()),
      output(workspace),
      manifest(workspace),
    ]),
    module: {
      rules: flatten([
        javascript(workspace),
        typescript(workspace, {typeCheck}),
        sass(workspace),
        images(workspace),
        fonts(workspace),
        graphql(workspace),
      ]),
    },
    resolve: resolve(workspace),
    resolveLoader: [
      paths.ownNodeModules,
      paths.nodeModules,
    ],
  });

  const webpackConfig = workspace.configFor('webpack');
  return webpackConfig
    ? webpackConfig.configure(config)
    : config;
}
