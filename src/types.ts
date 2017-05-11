export type Tool = 'sass' | 'typescript';

export interface TypeScriptConfig {
  tool: 'typescript',
}

export interface SassConfig {
  tool: 'sass',
  includePaths: string[],
}

export interface ConfigMap {
  sass: SassConfig,
  typescript: TypeScriptConfig,
}

export type ToolConfig = SassConfig | TypeScriptConfig;
