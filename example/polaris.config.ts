import {Plugins} from '../src';

export default function createConfig(configure: Plugins) {
  return {
    plugins: [
      configure.graphql({
        endpoint: 'https://app.myshopify.com/services/ping/graphql_schema',
      }),
    ],
  };
}
