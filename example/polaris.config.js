/* eslint-env node */

module.exports = function createConfig(configure) {
  return {
    plugins: [
      configure.graphql({
        endpoint: 'https://app.myshopify.com/services/ping/graphql_schema',
      }),
    ],
  };
};
