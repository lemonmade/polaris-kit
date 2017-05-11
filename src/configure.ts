import {Tool, TypeScriptConfig, SassConfig} from './types';

interface SassUserConfig {
  includePaths?: SassConfig['includePaths'],
}

export default class Configure {
  typeScript(): TypeScriptConfig {
    return {tool: 'typescript'};
  }

  sass({includePaths = []}: SassUserConfig): SassConfig {
    return {
      tool: 'sass',
      includePaths,
    };
  }
}
