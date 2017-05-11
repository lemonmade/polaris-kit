import Env from '../../env';
import {UserConfig} from '../../config';
import {sass, typeScript} from './loaders';

export default function webpack(env: Env, userConfig: UserConfig) {
  return {
    module: {
      loaders: flatten([
        sass(env, userConfig),
        typeScript(env, userConfig),
      ]),
    },
  };
}

function flatten(arr: ({} | null | {}[])[]) {
  const all: {}[] = [];

  arr.forEach((item) => {
    if (item == null) { return; }
    if (Array.isArray(item)) { all.push(...item); }
    all.push(item);
  })

  return all;
}
