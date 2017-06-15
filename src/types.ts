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

export interface JestPlugin {
  plugin: 'jest',
  setupRun?: string,
  setupTest?: string,
}

export type Plugin = JestPlugin | SassPlugin | TypeScriptPlugin | WebpackPlugin;

export interface PluginMap {
  jest: JestPlugin,
  sass: SassPlugin,
  typescript: TypeScriptPlugin,
  webpack: WebpackPlugin,
}
