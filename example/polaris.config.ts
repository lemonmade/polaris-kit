import {join} from 'path';
import {Plugins} from '../src';

export default function createConfig(configure: Plugins) {
  return {
    plugins: [
      configure.sass({includePaths: [join(process.cwd(), 'styles')]}),
      configure.webpack((config) => ({...config, foo: 'bar'})),
    ],
  };
}
