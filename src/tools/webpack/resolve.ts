import * as path from 'path';
import {Workspace} from '../../workspace';
import {ifElse, removeNullValues, flatten} from '../../utilities';

export default function resolve(workspace: Workspace) {
  const {env, project, paths} = workspace;

  return removeNullValues({
    // TODO: check if these need to actually exist before being included
    modules: [
      paths.packages,
      'node_modules',
      paths.app,
    ],
    extensions: flatten([
      '.js',
      ifElse(project.usesReact, '.jsx'),
      '.json',
      ifElse(project.usesTypeScript, '.ts'),
      ifElse(project.usesTypeScript && project.usesReact, '.tsx'),
    ]),
    mainFields: ifElse(
      env.isServer,
      ['jsnext:main', 'module', 'main'],
      ['browser', 'jsnext:main', 'module', 'main'],
    ),
    alias: ifElse(
      project.usesPolaris && env.isProduction,
      {'@shopify/polaris': path.join(paths.nodeModules, '@shopify/polaris/src')},
    ),
  });
}
