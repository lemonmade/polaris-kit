import {
  SassPlugin,
  TypeScriptPlugin,
  WebpackPlugin,
} from './types';

export function typeScript(): TypeScriptPlugin {
  return {plugin: 'typescript'};
}

export function webpack(configure: WebpackPlugin['configure']): WebpackPlugin {
  return {
    plugin: 'webpack',
    configure,
  };
}

export interface SassUserPlugin {
  includePaths?: SassPlugin['includePaths'],
}

export function sass({includePaths = []}: SassUserPlugin): SassPlugin {
  return {
    plugin: 'sass',
    includePaths,
  };
}
