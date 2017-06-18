import {join} from 'path';
import {svgOptions as svgOptimizationOptions} from '@shopify/images/optimize';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';

import {Workspace} from '../../workspace';
import {flatten, ifElse} from '../../utilities';

export function sass(workspace: Workspace) {
  const {env, project, paths} = workspace;

  const rules = [];
  const polarisRoot = join(paths.nodeModules, '@shopify/polaris');
  const globalResources = flatten([
    // TODO: need to check this exists
    join(paths.app, 'styles/settings.scss'),
    ifElse(project.usesPolaris, [
      join(polarisRoot, 'styles/foundation.scss'),
      join(polarisRoot, 'styles/shared.scss'),
    ]),
  ]);

  if (project.usesPolaris) {
    if (env.isServer) {
      rules.push({
        test: /\.scss$/,
        include: [polarisRoot],
        use: flatten([
          {
            loader: 'css-loader/locals',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[hash:base64:5]',
            },
          },
          {loader: 'sass-loader'},
          ifElse(globalResources.length > 0, {
            loader: 'sass-resources-loader',
            options: {
              resources: globalResources,
            },
          }),
        ]),
      });
    } else if (env.isProductionClient) {
      rules.push({
        test: /\.scss$/,
        include: [polarisRoot],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: flatten([
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                modules: true,
                importLoaders: 1,
                localIdentName: '[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {sourceMap: true},
            },
            {
              loader: 'sass-loader',
              options: {sourceMap: true},
            },
            ifElse(globalResources.length > 0, {
              loader: 'sass-resources-loader',
              options: {
                resources: globalResources,
              },
            }),
          ]),
        }),
      });
    } else {
      rules.push({
        test: /\.scss$/,
        include: [polarisRoot],
        use: ['happypack/loader?id=polaris-styles'],
      });
    }
  }

  if (env.isServer) {
    rules.push({
      test: /\.scss$/,
      exclude: /node_modules/,
      use: flatten([
        {
          loader: 'css-loader/locals',
          options: {
            modules: true,
            importLoaders: 1,
            localIdentName: ifElse(env.isProduction, '[hash:base64:5]', '[name]-[local]_[hash:base64:5]'),
          },
        },
        {loader: 'sass-loader'},
        ifElse(globalResources.length > 0, {
          loader: 'sass-resources-loader',
          options: {
            resources: globalResources,
          },
        }),
      ]),
    });
  } else if (env.isProductionClient) {
    rules.push({
      test: /\.scss$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: flatten([
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              importLoaders: 1,
              localIdentName: '[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {sourceMap: true},
          },
          {
            loader: 'sass-loader',
            options: {sourceMap: true},
          },
          ifElse(globalResources.length > 0, {
            loader: 'sass-resources-loader',
            options: {
              resources: globalResources,
            },
          }),
        ]),
      }),
    });
  } else {
    rules.push({
      test: /\.scss$/,
      exclude: /node_modules/,
      use: ['happypack/loader?id=styles'],
    });
  }

  return rules;
}

const ICON_PATH_REGEX = /icons\/.*\.svg$/;
const IMAGE_PATH_REGEX = /\.(jpe?g|png|gif|svg)$/;

export function images(workspace: Workspace) {
  const {usesPolaris} = workspace.project;

  return flatten([
    ifElse(usesPolaris, {
      test(resource: string) {
        return ICON_PATH_REGEX.test(resource);
      },
      use: [{
        loader: '@shopify/images/icon-loader',
      }, {
        loader: 'image-webpack-loader',
        options: {
          svgo: svgOptimizationOptions(),
        },
      }],
    }),

    {
      test(resource: string) {
        return (
          IMAGE_PATH_REGEX.test(resource) &&
          (!usesPolaris || !ICON_PATH_REGEX.test(resource))
        );
      },
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          emitFile: workspace.env.isClient,
        },
      }, {
        loader: 'image-webpack-loader',
        options: {
          svgo: svgOptimizationOptions(),
        },
      }],
    },
  ]);
}

export function fonts(workspace: Workspace) {
  return {
    test: /\.woff2$/,
    loader: 'url-loader',
    options: {
      limit: 50000,
      mimetype: 'application/font-woff',
      name: './fonts/[name].[ext]',
    },
  };
}

function babelOptionsForWorkspace(workspace: Workspace) {
  return {
    babelrc: false,
    presets: babelPresetForWorkspace(workspace),
  };
}

function babelPresetForWorkspace(workspace: Workspace) {
  const presets = [
    [ifElse(workspace.env.isClient, 'shopify/web', 'shopify/node'), {modules: false}],
  ];

  if (!workspace.project.usesReact) { return presets; }

  // For projects that have not/ can not update past babel-preset-shopify 15,
  // we don't want to enable to options added later than that
  return presets.concat([
    workspace.env.isServer || workspace.project.hasDependency('babel-preset-shopify', /15/)
      ? 'shopify/react'
      : ['shopify/react', {hot: workspace.env.isDevelopment}]
  ]);
}

export function javascript(workspace: Workspace) {
  return {
    test: /\.js$/,
    exclude: [
      /node_modules/,
      workspace.paths.build,
    ],
    loader: 'babel-loader',
    options: babelOptionsForWorkspace(workspace),
  };
}

export function typescript(workspace: Workspace, {typeCheck = true} = {}) {
  const {project, paths} = workspace;
  
  if (!project.usesTypeScript && !project.usesPolaris) {
    return null;
  }

  return {
    test: /\.tsx?$/,
    loader: 'awesome-typescript-loader',
    include: flatten([
      ifElse(project.usesTypeScript, paths.app),
      ifElse(project.isNode && project.usesTypeScript, [
        join(paths.root, 'client'),
        join(paths.root, 'server'),
        join(paths.root, 'config'),
        join(paths.root, 'packages'),
      ]),
      // TODO: ask Gord why
      // ...typeScriptPaths,
      ifElse(project.usesPolaris, join(paths.nodeModules, '@shopify/polaris')),
    ]),
    options: {
      silent: true,
      useBabel: true,
      useCache: true,
      transpileOnly: !typeCheck,
      // TODO: ask Gord why
      // compiler: join(paths.app.nodeModules, 'typescript'),
      cacheDirectory: join(paths.build, 'cache/.typescript'),
      babelOptions: babelOptionsForWorkspace(workspace),
    },
  };
}

export function graphql(workspace: Workspace) {
  if (!workspace.project.usesGraphQL) { return null; }

  return {
    test: /\.graphql$/,
    loader: 'graphql-tag/loader',
  };
}
