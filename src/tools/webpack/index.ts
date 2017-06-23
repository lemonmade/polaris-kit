import * as webpack from 'webpack';
import Tasks from '../../tasks';
import {Workspace} from '../../workspace';
import createConfig from './config';

export {createConfig};

const TASK = Symbol('Webpack');

export interface Options {
  sourceMaps: boolean,
  typeCheck: boolean,
  report: boolean,
}

export default function runWebpack(
  workspace: Workspace,
  options: Partial<Options> = {},
  tasks = new Tasks(),
) {
  if (tasks.hasPerformed(TASK, workspace)) { return; }
  tasks.perform(TASK, workspace);

  const config = createConfig(workspace, options);
  const compiler = webpack(config);

  return new Promise((resolve, reject) => {
    compiler.run((err: Error, stats: webpack.Stats) => {
      if (err) {
        throw err;
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(info.errors);
        reject(new Error(info.errors));
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }

      resolve();
    });
  });
}
