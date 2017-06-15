import {
  SassPlugin,
  TypeScriptPlugin,
  WebpackPlugin,
  JestPlugin,
} from './types';

export interface JestPluginConfig {
  setupTest?: JestPlugin['setupTest'],
  setupRun?: JestPlugin['setupRun'],
}

export function jest({setupTest, setupRun}: JestPluginConfig): JestPlugin {
  return {
    plugin: 'jest',
    setupTest,
    setupRun,
  };
}

export interface SassPluginConfig {
  includePaths?: SassPlugin['includePaths'],
}

export function sass({includePaths = []}: SassPluginConfig): SassPlugin {
  return {
    plugin: 'sass',
    includePaths,
  };
}

export function typeScript(): TypeScriptPlugin {
  return {plugin: 'typescript'};
}

export function webpack(configure: WebpackPlugin['configure']): WebpackPlugin {
  return {
    plugin: 'webpack',
    configure,
  };
}
