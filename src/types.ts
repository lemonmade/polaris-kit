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

export type Plugin = SassPlugin | TypeScriptPlugin | WebpackPlugin;

export interface PluginMap {
  sass: SassPlugin,
  typescript: TypeScriptPlugin,
  webpack: WebpackPlugin,
}
