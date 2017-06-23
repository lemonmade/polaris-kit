export interface CDNPlugin {
  plugin: 'cdn',
  url: string,
}

export interface EntryPlugin {
  plugin: 'entry',
  entries: string | string[] | {[key: string]: string | string[]},
}

export interface JestPlugin {
  plugin: 'jest',
  setupRun?: string,
  setupTest?: string,
}

export interface GraphQLPlugin {
  plugin: 'graphql',
  endpoint: string,
}

export interface SassPlugin {
  plugin: 'sass',
  includePaths: string[],
}

export interface TypeScriptPlugin {
  plugin: 'typescript',
}

export interface WebpackPlugin {
  plugin: 'webpack',
  configure(config: object): object,
}

export type Plugin = EntryPlugin | CDNPlugin | GraphQLPlugin | JestPlugin | SassPlugin | TypeScriptPlugin | WebpackPlugin;

export interface PluginMap {
  cdn: CDNPlugin,
  entry: EntryPlugin,
  graphql: GraphQLPlugin,
  jest: JestPlugin,
  sass: SassPlugin,
  typescript: TypeScriptPlugin,
  webpack: WebpackPlugin,
}
