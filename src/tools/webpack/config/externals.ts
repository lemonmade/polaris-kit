const nodeExternals = require('webpack-node-externals');
import {Workspace} from '../../../workspace';
import {flatten, ifElse} from '../../../utilities';

export default function externals({env, project}: Workspace) {
  if (env.isClient) { return null; }

  return nodeExternals({
    // Add any dependencies here that need to be processed by Webpack
    // source-map-support is always excluded so that it is embedded in
    // the server bundle
    whitelist: flatten([
      'source-map-support/register',

      // We need to actually bundle Polaris in production so that we can
      // transpile the class names to the same hashed values as we do
      // for the (bundled) client version.
      ifElse(project.usesPolaris && env.isProductionServer, '@shopify/polaris'),
    ]),
  });
}
