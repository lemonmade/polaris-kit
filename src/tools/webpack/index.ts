import * as webpack from 'webpack';
import Runner from '../../runner';
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
  runner = new Runner(),
) {
  if (runner.hasPerformed(TASK, workspace)) { return; }
  runner.perform(TASK, workspace);

  const config = createConfig(workspace, options);
  const compiler = webpack(config);

  return new Promise((resolve, reject) => {
    compiler.run((err: Error, stats: webpack.Stats) => {
      if (err) {
        reject(err);
        return;
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(info.errors);
        reject(new Error(info.errors));
      }

      if (stats.hasWarnings()) {
        for (const warning of info.warnings) {
          runner.log.warn(warning);
        }
      }

      runner.log.info(`Build bundle:\n${stats.toString({
        colors: true,
        assets: true,
        chunks: false,
        timings: false,
      })}`);

      resolve();
    });
  });
}
