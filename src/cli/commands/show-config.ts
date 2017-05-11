import Env from '../../env';
import loadConfig from '../../config';

export const command = 'show-config';

export function handler() {
  const env = new Env({target: 'client', mode: 'development'});
  const config = loadConfig(env);

  console.log(JSON.stringify(config.webpack, null, 2));
  console.log(JSON.stringify(config.rollup, null, 2));
}
