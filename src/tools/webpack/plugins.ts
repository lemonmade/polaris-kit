import * as webpack from 'webpack';
import ExtractTextPlugin = require('extract-text-webpack-plugin');
import BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
import WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
import HashOutputPlugin = require('webpack-plugin-hash-output');
import CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
import {CheckerPlugin} from 'awesome-typescript-loader';

import {Workspace} from '../../workspace';
import {ifElse, flatten} from '../../utilities';

export function report() {
  return new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: 'bundle-analysis/report.html',
    generateStatsFile: true,
    statsFilename: './bundle-analysis/stats.json',
    openAnalyzer: false,
  });
}

const happypackThreadPool = Happypack.ThreadPool({
  size: cpus().length,
});

const hashFunction = 'sha256'; // For subresource integrity checks.
const hashDigestLength = 64;

export function styles({env, paths, project}: Workspace) {
  function createHappypackPlugin({id, loaders}: {id: string, loaders: any[]}) {
    return new Happypack({
      id,
      verbose: false,
      threadPool: happypackThreadPool,
      tempDir: resolve(paths.build, 'cache/.happypack'),
      loaders,
    });
  }

  return flatten([
    ifElse(
      env.isProductionClient,
      new ExtractTextPlugin({filename: `[name]-[${hashFunction}:contenthash:hex:${hashDigestLength}].css`, allChunks: true}),
    ),
    ifElse(
      env.isDevelopmentClient,
      createHappypackPlugin({
        id: 'styles',
        loaders: [
          {path: 'style-loader'},
          {
            path: 'css-loader',
            query: {
              sourceMap: true,
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]-[local]_[hash:base64:5]',
            },
          },
          {
            path: 'postcss-loader',
            query: {sourceMap: true},
          },
          {
            path: 'sass-loader',
            query: {sourceMap: true},
          },
        ],
      }),
    ),
    ifElse(
      project.usesPolaris && env.isDevelopmentClient,
      createHappypackPlugin({
        id: 'polaris-styles',
        loaders: [
          {path: 'style-loader'},
          {
            path: 'css-loader',
            query: {
              sourceMap: false,
              modules: true,
              importLoaders: 1,
              localIdentName: '[local]',
            },
          },
          {
            path: 'postcss-loader',
            query: {sourceMap: false},
          },
          {
            path: 'sass-loader',
            query: {sourceMap: false},
          },
        ],
      })
    ),
  ]);
}

export function typescript(workspace: Workspace) {
  if (!workspace.project.usesTypeScript) { return null; }
  return new CheckerPlugin();
}

export function watch({env, paths}: Workspace) {
  if (!env.isDevelopment) { return null; }

  return [
    new WatchMissingNodeModulesPlugin(paths.nodeModules),
    new webpack.WatchIgnorePlugin([/\.d\.ts$/]),
  ];
}

export function manifest(workspace: Workspace) {
  // Generates a JSON file containing a map of all the output files for
  // our webpack bundle.  A necessisty for our server rendering process
  // as we need to interogate these files in order to know what JS/CSS
  // we need to inject into our HTML.
  return new AssetsPlugin({
    filename: ifElse(
      workspace.project.isRails,
      // TODO: add a config option to specify manifest file name
      'sewing-kit-manifest.json',
      'assets.json',
    ),
    // TODO, get actual build dir
    path: join(workspace.paths.build, workspace.env.target),
  });
}

export function output({env}: Workspace) {
  return flatten([
    ifElse(env.isDevelopmentClient, new webpack.NamedModulesPlugin()),
    ifElse(env.isDevelopment, new webpack.NoEmitOnErrorsPlugin()),
    ifElse(env.isDevelopmentServer, new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1})),
    ifElse(env.isProductionClient, new HashOutputPlugin()),
    ifElse(env.isProductionClient, new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      comments: false,
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
    })),
  ]);
}

export function input() {
  return new CaseSensitivePathsPlugin();
}

export function define({env}: Workspace) {
  return new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(env.mode),
  });
}
