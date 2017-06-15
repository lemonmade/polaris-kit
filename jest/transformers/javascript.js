const {createTransformer} = require('babel-jest');

const babelOptions = {
  babelrc: false,
  presets: [
    ['shopify/node', {modules: 'commonjs'}],
    'shopify/react',
  ],
};

module.exports = createTransformer(babelOptions);
