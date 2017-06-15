export interface TypeScriptConfig {
  tool: 'TypeScript',
}

export function typeScript(): TypeScriptConfig {
  return {tool: 'TypeScript'};
}

export interface WebpackConfig {
  tool: 'Webpack',
  configure(config: object): object,
}

export function webpack(configure: WebpackConfig['configure']): WebpackConfig {
  return {
    tool: 'Webpack',
    configure,
  };
}

export interface SassConfig {
  tool: 'Sass',
  includePaths: string[],
}

export interface SassUserConfig {
  includePaths?: SassConfig['includePaths'],
}

export function sass({includePaths = []}: SassUserConfig): SassConfig {
  return {
    tool: 'Sass',
    includePaths,
  };
}

export type ToolConfig = SassConfig | TypeScriptConfig | WebpackConfig;

export interface ConfigMap {
  Sass: SassConfig,
  TypeScript: TypeScriptConfig,
  Webpack: WebpackConfig,
}
