import * as path from 'path';
import {Workspace} from '../../../workspace';
import {ifElse} from '../../../utilities';

// For subresource integrity checks.
const HASH_FUNCTION = 'sha256';
const HASH_DIGEST_LENGTH = 64;

export interface Options {
  vscodeDebug: boolean,
}

export default function output(workspace: Workspace, {vscodeDebug}: Options) {
  const {project, env, paths} = workspace;
  const outPath = ifElse(
    project.isRails,
    ifElse(env.isDevelopment, paths.build, path.join(paths.root, 'public/bundles')),
    path.join(paths.build, env.target),
  );

  const cdnPlugin = workspace.configFor('cdn');

  const vscodeOutput = vscodeDebug
    ? {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
    }
    : {};

  return {
    path: outPath,
    publicPath: cdnPlugin ? cdnPlugin.url : '/assets/',
    filename: ifElse(env.isProductionClient, '[name]-[chunkhash].js', '[name].js'),
    chunkFilename: '[name]-[chunkhash].js',
    libraryTarget: ifElse(env.isServer, 'commonjs2', 'var'),
    hashFunction: HASH_FUNCTION,
    hashDigestLength: HASH_DIGEST_LENGTH,
    ...vscodeOutput,
  };
}
