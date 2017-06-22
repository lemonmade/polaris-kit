import * as path from 'path';
import {createWorkspace, createDependency} from 'tests/utilities';
import Env from 'src/env';
import * as plugins from 'src/plugins';
import webpackConfig, {Config} from 'src/tools/webpack/config';

interface Rule {
  [key: string]: any,
}

const server = new Env({target: 'server'});
const client = new Env({target: 'client'});

describe('webpackConfig()', () => {
  describe('cache', () => {
    it('always sets cacheing to true', () => {
      expect(webpackConfig(createWorkspace({env: client}))).toHaveProperty('cache', true);
      expect(webpackConfig(createWorkspace({env: server}))).toHaveProperty('cache', true);
    });
  });

  describe('target', () => {
    it('has the appropriate target for the environment', () => {
      expect(webpackConfig(createWorkspace({env: client}))).toHaveProperty('target', 'web');
      expect(webpackConfig(createWorkspace({env: server}))).toHaveProperty('target', 'node');
    });
  });

  describe('node', () => {
    it('sets up the rewrites for the server environment', () => {
      expect(webpackConfig(createWorkspace({env: client}))).not.toHaveProperty('node');
      expect(webpackConfig(createWorkspace({env: server}))).toHaveProperty('node', {
        __dirname: true,
        __filename: true,
      });
    });
  });

  describe('resolve', () => {
    describe('modules', () => {
      it('includes node_modules, app root, and packages', () => {
        const workspace = createWorkspace({isRails: true});
        expect(webpackConfig(workspace)).toHaveProperty('resolve.modules', [
          workspace.paths.packages,
          'node_modules',
          workspace.paths.app,
        ]);
      });
    });

    describe('extensions', () => {
      it('includes only basic extensions by default', () => {
        const workspace = createWorkspace();
        expect(webpackConfig(workspace)).toHaveProperty('resolve.extensions', [
          '.js',
          '.json',
        ]);
      });

      it('includes .jsx when the project uses React', () => {
        const workspace = createWorkspace({
          dependencies: createDependency('react'),
        });
        expect(webpackConfig(workspace)).toHaveProperty('resolve.extensions', [
          '.js',
          '.jsx',
          '.json',
        ]);
      });

      it('includes .ts when the project uses TypeScript', () => {
        const workspace = createWorkspace({
          devDependencies: createDependency('typescript'),
        });
        expect(webpackConfig(workspace)).toHaveProperty('resolve.extensions', [
          '.js',
          '.json',
          '.ts',
        ]);
      });

      it('includes .ts and .tsx when the project uses TypeScript and React', () => {
        const workspace = createWorkspace({
          dependencies: createDependency('react'),
          devDependencies: createDependency('typescript'),
        });
        expect(webpackConfig(workspace)).toHaveProperty('resolve.extensions', [
          '.js',
          '.jsx',
          '.json',
          '.ts',
          '.tsx',
        ]);
      });
    });

    describe('mainFields', () => {
      it('includes appropriate fields for server environments', () => {
        const workspace = createWorkspace({
          env: new Env({target: 'server'}),
        });
        expect(webpackConfig(workspace)).toHaveProperty('resolve.mainFields', [
          'jsnext:main',
          'module',
          'main',
        ]);
      });

      it('includes the browser field for client environments', () => {
        const workspace = createWorkspace({
          env: new Env({target: 'client'}),
        });
        expect(webpackConfig(workspace)).toHaveProperty('resolve.mainFields', [
          'browser',
          'jsnext:main',
          'module',
          'main',
        ]);
      });
    });

    describe('alias', () => {
      describe('@shopify/polaris', () => {
        it('does not include an alias for @shopify/polaris when it is not a dependency', () => {
          const workspace = createWorkspace();
          expect(webpackConfig(workspace)).not.toHaveProperty('resolve.alias.@shopify/polaris');
        });

        it('does not include an alias for @shopify/polaris when it is not production', () => {
          const workspace = createWorkspace({
            dependencies: createDependency('@shopify/polaris'),
            env: new Env({mode: 'development'}),
          });
          expect(webpackConfig(workspace)).not.toHaveProperty('resolve.alias.@shopify/polaris');
        });

        it('includes an alias for @shopify/polaris to the source folder in production', () => {
          const workspace = createWorkspace({
            dependencies: createDependency('@shopify/polaris'),
            env: new Env({mode: 'production'}),
          });
          expect(webpackConfig(workspace).resolve.alias['@shopify/polaris']).toMatch(/node_modules\/@shopify\/polaris\/src/);
        });
      });
    });
  });

  describe('resolveLoader', () => {
    it('includes own and project node_modules', () => {
      const workspace = createWorkspace();
      expect(webpackConfig(workspace)).toHaveProperty('resolveLoader', [
        workspace.paths.ownNodeModules,
        workspace.paths.nodeModules,
      ]);
    });
  });

  describe('devtool', () => {
    it('uses the source-map devtool for production servers', () => {
      const workspace = createWorkspace({
        env: new Env({target: 'server', mode: 'production'}),
      });
      expect(webpackConfig(workspace)).toHaveProperty('devtool', 'source-map');
    });

    it('uses the hidden-source-map devtool for production clients', () => {
      const workspace = createWorkspace({
        env: new Env({target: 'client', mode: 'production'}),
      });
      expect(webpackConfig(workspace)).toHaveProperty('devtool', 'hidden-source-map');
    });

    it('uses the source-map devtool for development', () => {
      const workspace = createWorkspace({
        env: new Env({mode: 'development'}),
      });
      expect(webpackConfig(workspace)).toHaveProperty('devtool', 'source-map');
    });

    it('uses the eval devtool for development when explicitly turned off', () => {
      const workspace = createWorkspace({
        env: new Env({mode: 'development'}),
      });
      expect(webpackConfig(workspace, {sourceMaps: false})).toHaveProperty('devtool', 'eval');
    });
  });

  describe('externals', () => {
    it('has no externals when it is the client bundle', () => {
      const workspace = createWorkspace({env: client});
      expect(webpackConfig(workspace)).not.toHaveProperty('externals');
    });

    // TODO
  });

  describe('entry', () => {
    it('uses the app path as the default entry point for Rails apps', () => {
      const workspace = createWorkspace({isRails: true});
      const {entry} = webpackConfig(workspace);
      expect(entry[entry.length - 1]).toBe(workspace.paths.app);
    });

    it('uses the client path as the default path for client node apps', () => {
      const workspace = createWorkspace({
        isRails: false,
        env: client,
      });
      const {entry} = webpackConfig(workspace);
      expect(entry[entry.length - 1]).toBe(path.join(workspace.paths.root, 'client'));
    });

    it('uses the client path as the default path for client node apps', () => {
      const workspace = createWorkspace({
        isRails: false,
        env: server,
      });
      const {entry} = webpackConfig(workspace);
      expect(entry[entry.length - 1]).toBe(path.join(workspace.paths.root, 'server'));
    });

    it('uses a passed string entry from plugins', () => {
      const workspace = createWorkspace({
        plugins: [plugins.entry('my-file.js')],
      });
      const {entry} = webpackConfig(workspace);
      expect(entry[entry.length - 1]).toBe('my-file.js');
    });

    it('uses a passed string array entry from plugins', () => {
      const files = ['file-one.ts', 'file-two.ts'];
      const workspace = createWorkspace({
        plugins: [plugins.entry(files)],
      });
      const {entry} = webpackConfig(workspace);

      expect(entry[entry.length - 2]).toBe(files[0]);
      expect(entry[entry.length - 1]).toBe(files[1]);
    });

    it('uses a passed object array entry from plugins', () => {
      const files = {
        one: ['file-one.ts'],
        two: ['file-two.ts', 'file-two-two.ts']
      };
      const workspace = createWorkspace({
        plugins: [plugins.entry(files)],
      });
      const {entry} = webpackConfig(workspace);

      expect(entry.one[entry.one.length - 1]).toBe(files.one[0]);
      expect(entry.two[entry.two.length - 2]).toBe(files.two[0]);
      expect(entry.two[entry.two.length - 1]).toBe(files.two[1]);
    });

    it('includes source-map-support for servers', () => {
      const serverWorkspace = createWorkspace({env: server});
      expect(webpackConfig(serverWorkspace).entry.includes('source-map-support/register')).toBe(true);

      const clientWorkspace = createWorkspace({env: client});
      expect(webpackConfig(clientWorkspace).entry.includes('source-map-support/register')).toBe(false);
    });

    it('includes regenerator-runtime for clients', () => {
      const clientWorkspace = createWorkspace({env: client});
      expect(webpackConfig(clientWorkspace).entry.includes('regenerator-runtime/runtime')).toBe(true);

      const serverWorkspace = createWorkspace({env: server});
      expect(webpackConfig(serverWorkspace).entry.includes('regenerator-runtime/runtime')).toBe(false);
    });

    it('does not include any Polaris files when it is not a dependency', () => {
      const workspace = createWorkspace({env: client});
      const {entry} = webpackConfig(workspace);
      
      if (Array.isArray(entry)) {
        entry.forEach((file) => {
          expect(file).not.toMatch(/@shopify\/polaris/);
        });
      } else {
        expect(entry).not.toMatch(/@shopify\/polaris/);
      }
    });

    it('includes the component Sass file for development clients', () => {
      const devWorkspace = createWorkspace({
        env: new Env({target: 'client', mode: 'development'}),
        dependencies: createDependency('@shopify/polaris'),
      });
      expect(webpackConfig(devWorkspace).entry.includes('@shopify/polaris/styles/components.scss')).toBe(true);

      const prodWorkspace = createWorkspace({
        env: new Env({target: 'client', mode: 'production'}),
        dependencies: createDependency('@shopify/polaris'),
      });
      expect(webpackConfig(prodWorkspace).entry.includes('@shopify/polaris/styles/components.scss')).toBe(false);
    });

    it('includes the global Sass file for all clients', () => {
      const clientWorkspace = createWorkspace({
        env: client,
        dependencies: createDependency('@shopify/polaris'),
      });
      expect(webpackConfig(clientWorkspace).entry.includes('@shopify/polaris/styles/global.scss')).toBe(true);

      const serverWorkspace = createWorkspace({
        env: server,
        dependencies: createDependency('@shopify/polaris'),
      });
      expect(webpackConfig(serverWorkspace).entry.includes('@shopify/polaris/styles/global.scss')).toBe(false);
    });
  });

  describe('output', () => {
    describe('path', () => {
      it('puts the files in the build directory for development Rails', () => {
        const workspace = createWorkspace({
          isRails: true,
          env: new Env({mode: 'development'}),
        });
        expect(webpackConfig(workspace)).toHaveProperty('output.path', workspace.paths.build);
      });

      it('puts the files in the public bundles directory for development Rails', () => {
        const workspace = createWorkspace({
          isRails: true,
          env: new Env({mode: 'production'}),
        });
        expect(webpackConfig(workspace)).toHaveProperty('output.path', path.join(workspace.paths.root, 'public/bundles'));
      });

      it('puts the files a directory matching the target for Node apps', () => {
        const clientWorkspace = createWorkspace({isRails: false, env: client});
        expect(webpackConfig(clientWorkspace)).toHaveProperty('output.path', path.join(clientWorkspace.paths.build, 'client'));

        const serverWorkspace = createWorkspace({isRails: false, env: server});
        expect(webpackConfig(serverWorkspace)).toHaveProperty('output.path', path.join(clientWorkspace.paths.build, 'server'));
      });
    });

    describe('filename', () => {
      it('appends the hash for production clients', () => {
        const workspace = createWorkspace({
          env: new Env({target: 'client', mode: 'production'}),
        });
        expect(webpackConfig(workspace)).toHaveProperty('output.filename', '[name]-[chunkhash].js');
      });

      it('uses just the name for all other outputs', () => {
        const devWorkspace = createWorkspace({
          env: new Env({target: 'client', mode: 'development'}),
        });
        expect(webpackConfig(devWorkspace)).toHaveProperty('output.filename', '[name].js');

        const serverWorkspace = createWorkspace({env: server});
        expect(webpackConfig(serverWorkspace)).toHaveProperty('output.filename', '[name].js');
      });
    });

    describe('chunkFilename', () => {
      it('uses the name and chunkhash', () => {
        const workspace = createWorkspace();
        expect(webpackConfig(workspace)).toHaveProperty('output.chunkFilename', '[name]-[chunkhash].js');
      });
    });

    // TODO: check if we can make this simplification
    describe('publicPath', () => {
      it('uses /assets/ when no CDN is provided', () => {
        const workspace = createWorkspace({
          plugins: [plugins.cdn({url: 'https://my.cdn.com'})],
        });
        expect(webpackConfig(workspace)).toHaveProperty('output.publicPath', 'https://my.cdn.com');
      });

      it('uses /assets/ when no CDN is provided', () => {
        const workspace = createWorkspace();
        expect(webpackConfig(workspace)).toHaveProperty('output.publicPath', '/assets/');
      });
    });

    describe('libraryTarget', () => {
      it('uses the commonJS target for the server', () => {
        const workspace = createWorkspace({env: server});
        expect(webpackConfig(workspace)).toHaveProperty('output.libraryTarget', 'commonjs2');
      });

      it('uses the var target for the client', () => {
        const workspace = createWorkspace({env: client});
        expect(webpackConfig(workspace)).toHaveProperty('output.libraryTarget', 'var');
      });
    });

    describe('hash', () => {
      it('uses the correct hashing strategy', () => {
        const config = webpackConfig(createWorkspace());
        expect(config).toHaveProperty('output.hashFunction', 'sha256');
        expect(config).toHaveProperty('output.hashDigestLength', 64);
      });
    });

    describe('devtool', () => {
      it('does not set any custom devtool formatting by default', () => {
        const config = webpackConfig(createWorkspace());
        expect(config).not.toHaveProperty('output.devtoolModuleFilenameTemplate');
        expect(config).not.toHaveProperty('output.devtoolFallbackModuleFilenameTemplate');
      });

      it('sets the devtool formatting for VSCode', () => {
        const config = webpackConfig(createWorkspace(), {vscodeDebug: true});
        expect(config).toHaveProperty('output.devtoolModuleFilenameTemplate', '[absolute-resource-path]');
        expect(config).toHaveProperty('output.devtoolFallbackModuleFilenameTemplate', '[absolute-resource-path]?[hash]');
      });
    });
  });

  describe('rules', () => {
    function findJavaScriptRule({module: {rules}}: Config) {
      return rules.find((rule: Rule) => (
        rule.test != null &&
        rule.test.source === /\.js$/.source &&
        rule.loader === 'babel-loader'
      ));
    }

    describe('javascript', () => {
      it('creates a rule with appropriate exclusions', () => {
        const workspace = createWorkspace();
        const config = webpackConfig(workspace);
        const rule = findJavaScriptRule(config);

        expect(rule).not.toBeUndefined();
        expect(rule).toHaveProperty('exclude', [
          /node_modules/,
          workspace.paths.build,
        ]);
      });

      it('uses the web Babel preset for the client', () => {
        const config = webpackConfig(createWorkspace({env: client}));
        const rule = findJavaScriptRule(config);
        expect(rule).toHaveProperty('options.presets.0', [
          'shopify/web',
          {modules: false},
        ]);
      });

      it('uses the Node Babel preset for the server', () => {
        const config = webpackConfig(createWorkspace({env: server}));
        const rule = findJavaScriptRule(config);
        expect(rule).toHaveProperty('options.presets.0', [
          'shopify/node',
          {modules: false},
        ]);
      });

      it('uses the React Babel preset when React is present', () => {
        const workspace = createWorkspace({
          dependencies: createDependency('react'),
        });
        const config = webpackConfig(workspace);
        const rule = findJavaScriptRule(config);
        expect(rule).toHaveProperty('options.presets.1', [
          'shopify/react',
          {hot: true},
        ]);
      });

      it('does not include newer options when using an old version of babel-preset-shopify', () => {
        const workspace = createWorkspace({
          dependencies: {
            ...createDependency('react'),
            'babel-preset-shopify': '15.0.0',
          },
        });
        const config = webpackConfig(workspace);
        const rule = findJavaScriptRule(config);
        expect(rule).toHaveProperty('options.presets.1', 'shopify/react');
      });

      it('adds a JavaScript rule even when there is TypeScript', () => {
        const config = webpackConfig(createWorkspace({
          devDependencies: createDependency('typescript'),
        }));
        const rule = findJavaScriptRule(config);
        expect(rule).not.toBeUndefined();
      });
    });

    describe('typescript', () => {
      function findTypeScriptRule({module: {rules}}: Config) {
        return rules.find((rule: Rule) => (
          rule.test != null &&
          rule.test.source === /\.tsx?$/.source &&
          rule.loader === 'awesome-typescript-loader'
        ));
      }

      it('does not include a rule when not using TypeScript or Polaris', () => {
        const config = webpackConfig(createWorkspace());
        const rule = findTypeScriptRule(config);
        expect(rule).toBeUndefined();
      });

      it('includes a rule with the appropriate options when using TypeScript', () => {
        const workspace = createWorkspace({
          devDependencies: createDependency('typescript'),
        });
        const config = webpackConfig(workspace);
        const rule = findTypeScriptRule(config);

        expect(rule).not.toBeUndefined();
        expect(rule).toHaveProperty('options', {
          silent: true,
          useBabel: true,
          useCache: true,
          transpileOnly: false,
          cacheDirectory: path.join(workspace.paths.build, 'cache/.typescript'),
          babelOptions: findJavaScriptRule(config).options,
        });
      });

      it('only transpiles when typeCheck is explicitly false', () => {
        const config = webpackConfig(createWorkspace({
          devDependencies: createDependency('typescript'),
        }), {typeCheck: false});
        const rule = findTypeScriptRule(config);
        expect(rule).toHaveProperty('options.transpileOnly', true);
      });

      it('includes the correct paths for Rails', () => {
        const workspace = createWorkspace({
          isRails: true,
          devDependencies: createDependency('typescript'),
        });
        const config = webpackConfig(workspace);
        const rule = findTypeScriptRule(config);

        expect(rule).toHaveProperty('include', [
          workspace.paths.app,
        ]);
      });

      it('includes the correct paths for Node', () => {
        const workspace = createWorkspace({
          isRails: false,
          dependencies: createDependency('@shopify/polaris'),
          devDependencies: createDependency('typescript'),
        });
        const config = webpackConfig(workspace);
        const rule = findTypeScriptRule(config);

        expect(rule).toHaveProperty('include', [
          workspace.paths.app,
          path.join(workspace.paths.root, 'client'),
          path.join(workspace.paths.root, 'server'),
          path.join(workspace.paths.root, 'config'),
          path.join(workspace.paths.root, 'packages'),
          path.join(workspace.paths.nodeModules, '@shopify/polaris'),
        ]);
      });

      it('includes the correct paths for Polaris-only', () => {
        const workspace = createWorkspace({
          dependencies: createDependency('@shopify/polaris'),
        });
        const config = webpackConfig(workspace);
        const rule = findTypeScriptRule(config);

        expect(rule).toHaveProperty('include', [
          path.join(workspace.paths.nodeModules, '@shopify/polaris'),
        ]);
      });
    });

    describe('images', () => {
      const fakeIconPath = path.resolve('icons/my-icon.svg');
      const fakeImagePath = path.resolve('icons/my-image.png');
      const fakeIllustrationPath = path.resolve('illustrations/my-illustration.svg');

      function findIconRule({module: {rules}}: Config) {
        return rules.find((rule: {[key: string]: any}) => {
          return (
            Array.isArray(rule.use) &&
            rule.use[0].loader === '@shopify/images/icon-loader' &&
            rule.use[1].loader === 'image-webpack-loader'
          );
        });
      }

      function findImageLoader({module: {rules}}: Config) {
        return rules.find((rule: Rule) => {
          return (
            Array.isArray(rule.use) &&
            rule.use[0].loader === 'url-loader'
          );
        });
      }

      function optimizesSVG(rule: Rule) {
        return (
          rule.loader === 'image-webpack-loader' &&
          rule.options.svgo != null
        );
      }

      it('adds an image loader that matches all images', () => {
        const config = webpackConfig(createWorkspace());
        const rule = findImageLoader(config);

        expect(rule).not.toBeUndefined();
        expect(rule.test(fakeIconPath)).toBe(true);
        expect(rule.test(fakeImagePath)).toBe(true);
        expect(rule.test(fakeIllustrationPath)).toBe(true);
        
      });

      it('emits files for images if on the client', () => {
        const config = webpackConfig(createWorkspace({env: client}));
        const rule = findImageLoader(config);
        expect(rule.use[0].options.emitFile).toBe(true);
      });

      it('does not emit files for images if on the client', () => {
        const config = webpackConfig(createWorkspace({env: server}));
        const rule = findImageLoader(config);
        expect(rule.use[0].options.emitFile).toBe(false);
      });

      it('optimizes SVGs in the image loader', () => {
        const config = webpackConfig(createWorkspace());
        const rule = findImageLoader(config);

        expect(optimizesSVG(rule.use[1])).toBe(true);
      });

      it('does not add an icon loader', () => {
        const workspace = createWorkspace();
        const config = webpackConfig(workspace);
        const rule = findIconRule(config);
        expect(rule).toBeUndefined();
      });

      describe('with polaris', () => {
        it('adds a rule that runs optimization and icon loading', () => {
          const workspace = createWorkspace({dependencies: createDependency('@shopify/polaris')});
          const config = webpackConfig(workspace);
          const rule = findIconRule(config);

          expect(rule).not.toBeUndefined();
          expect(rule.test(fakeIconPath)).toBe(true);
          expect(rule.test(fakeImagePath)).toBe(false);
          expect(rule.test(fakeIllustrationPath)).toBe(false);
          expect(optimizesSVG(rule.use[1])).toBe(true);
        });

        it('adds an image loader that does not match icons', () => {
          const workspace = createWorkspace({dependencies: createDependency('@shopify/polaris')});
          const config = webpackConfig(workspace);
          const rule = findImageLoader(config);

          expect(rule).not.toBeUndefined();
          expect(rule.test(fakeIconPath)).toBe(false);
          expect(rule.test(fakeImagePath)).toBe(true);
          expect(rule.test(fakeIllustrationPath)).toBe(true);
          expect(optimizesSVG(rule.use[1])).toBe(true);
        });
      });
    });

    describe('fonts', () => {
      function findFontRule({module: {rules}}: Config) {
        return rules.find((rule: Rule) => (
          rule.test != null &&
          rule.test.source === /\.woff2$/.source &&
          rule.loader === 'url-loader'
        ));
      }

      it('includes the rule', () => {
        const config = webpackConfig(createWorkspace());
        const rule = findFontRule(config);
        expect(rule).not.toBeUndefined();
      });
    });

    describe('graphql', () => {
      function findGraphQLRule({module: {rules}}: Config) {
        return rules.find((rule: Rule) => (
          rule.test != null &&
          rule.test.source === /\.graphql$/.source &&
          rule.loader === 'graphql-tag/loader'
        ));
      }

      it('does not include the rule by default', () => {
        const config = webpackConfig(createWorkspace());
        const rule = findGraphQLRule(config);
        expect(rule).toBeUndefined();
      });

      it('includes it for a project with GraphQL', () => {
        const workspace = createWorkspace({
          dependencies: createDependency('graphql-tag'),
        });
        const config = webpackConfig(workspace);
        const rule = findGraphQLRule(config);
        expect(rule).not.toBeUndefined();
      });
    });
  });
});
