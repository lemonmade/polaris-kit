
    module.exports = {
      parserOptions: {ecmaVersion: 6},
      plugins: ['graphql'],
      rules: {
        'graphql/template-strings': ['error', {
          env: 'literal',
          schemaJsonFilepath: "/Users/chrissauve/Projects/polaris-kit/example/build/schema.json",
        }],
      },
    };
  