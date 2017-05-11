import Env from '../../../env';
import {UserConfig} from '../../../config';

export default function sass(env: Env, userConfig: UserConfig) {
  const sassConfig = userConfig.configForTool('sass');

  return {
    test: /\.scss$/,
    loaders: [
      {
        loader: 'sass-loader',
        options: {
          includePaths: sassConfig ? sassConfig.includePaths : [],
        },
      },
    ],
  };
}
