import {join} from 'path';
import {Env, Configure} from './src';

export default function createConfig(configure: Configure, env: Env) {
  return {
    tools: [
      configure.sass({includePaths: [join(process.cwd(), 'styles')]}),
      configure.webpack((config) => ({...config, foo: 'bar'})),
    ],
  };
}
