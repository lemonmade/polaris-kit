import {join} from 'path';
import {Env, Plugins} from './src';

export default function createConfig(configure: Plugins, env: Env) {
  return {
    plugins: [
      configure.sass({includePaths: [join(process.cwd(), 'styles')]}),
      configure.webpack((config) => ({...config, foo: 'bar'})),
    ],
  };
}
