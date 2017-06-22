import {
  SassPlugin,
  TypeScriptPlugin,
  WebpackPlugin,
  JestPlugin,
  GraphQLPlugin,
  CDNPlugin,
  EntryPlugin,
} from './types';

export interface CDNPluginConfig {
  url: string,
}

export function cdn({url}: CDNPluginConfig): CDNPlugin {
  return {plugin: 'cdn', url};
}

export function entry(entries: EntryPlugin['entries']): EntryPlugin {
  return {plugin: 'entry', entries};
}

export interface GraphQLPluginConfig {
  endpoint: GraphQLPlugin['endpoint'],
}

export function graphql({endpoint}: GraphQLPluginConfig): GraphQLPlugin {
  return {plugin: 'graphql', endpoint};
}

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
