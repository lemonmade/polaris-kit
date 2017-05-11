import {join} from 'path';
import {Env, Configure} from './src';

export default function createConfig(configure: Configure, env: Env) {
  return [
    configure.sass({
      includePaths: [join(env.paths.root, 'styles')],
    }),
  ];
}
