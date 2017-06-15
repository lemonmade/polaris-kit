import * as path from 'path';
import {Workspace} from '../../workspace';
import {ifElse, removeNullValues, flatten} from '../../utilities';

export default function resolve(workspace: Workspace) {
  const {env} = workspace;

  return removeNullValues({
    extensions: flatten([
      '.js',
      ifElse(workspace.usesReact, '.jsx'),
      '.json',
      ifElse(workspace.usesTypeScript, '.ts'),
      ifElse(workspace.usesTypeScript && workspace.usesReact, '.tsx'),
    ]),
    mainFields: ifElse(
      env.isServer,
      ['jsnext:main', 'module', 'main'],
      ['browser', 'jsnext:main', 'module', 'main'],
    ),
    alias: ifElse(
      workspace.usesPolaris && env.isProduction,
      {'@shopify/polaris': path.resolve(workspace.nodeModules, '@shopify/polaris/src')},
    ),
  });
}
