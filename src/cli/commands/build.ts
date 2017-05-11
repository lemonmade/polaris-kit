import Env from '../../env';
import loadConfig from '../../config';

export const command = 'build';

export function handler() {
  const env = new Env({target: 'client', mode: 'development'});
  const config = loadConfig(env);
  // do something with the config
}
