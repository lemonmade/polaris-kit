import Env from '../../../env';
import {UserConfig} from '../../../config';

export default function typeScript(env: Env, userConfig: UserConfig) {
  if (!env.typescript) {
    return null;
  }

  const typeScriptConfig = userConfig.configForTool('typescript');

  return {
    test: /\.tsx?$/,
    loaders: [
      {
        loader: 'awesome-typescript-loader',
        options: {
          useBabel: true,
        },
      },
    ],
  };
}
