/* eslint-env node */

module.exports = function createConfig(plugins) {
  return {
    name: 'example',
    plugins: [
      plugins.cdn({url: 'https://cdn.myshopify.com/example/'}),
      plugins.graphql({endpoint: 'https://app.myshopify.com/services/ping/graphql_schema'}),
    ],
  };
};
