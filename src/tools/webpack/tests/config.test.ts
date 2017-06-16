import {createWorkspace} from 'tests/utilities';
import Env from '../../../env';
import webpackConfig from '../config';

const server = new Env({target: 'server'});
const client = new Env({target: 'client'});

describe('webpack()', () => {
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
          dependencies: {react: '15.0.0'},
        });
        expect(webpackConfig(workspace)).toHaveProperty('resolve.extensions', [
          '.js',
          '.jsx',
          '.json',
        ]);
      });

      it('includes .ts when the project uses TypeScript', () => {
        const workspace = createWorkspace({
          devDependencies: {typescript: '2.0.0'},
        });
        expect(webpackConfig(workspace)).toHaveProperty('resolve.extensions', [
          '.js',
          '.json',
          '.ts',
        ]);
      });

      it('includes .ts and .tsx when the project uses TypeScript and React', () => {
        const workspace = createWorkspace({
          dependencies: {react: '15.0.0'},
          devDependencies: {typescript: '2.0.0'},
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
            dependencies: {'@shopify/polaris': '1.0.0'},
            env: new Env({mode: 'development'}),
          });
          expect(webpackConfig(workspace)).not.toHaveProperty('resolve.alias.@shopify/polaris');
        });

        it('includes an alias for @shopify/polaris to the source folder in production', () => {
          const workspace = createWorkspace({
            dependencies: {'@shopify/polaris': '1.0.0'},
            env: new Env({mode: 'production'}),
          });
          expect(webpackConfig(workspace).resolve.alias['@shopify/polaris']).toMatch(/node_modules\/@shopify\/polaris\/src/);
        });
      });
    });
  });
});
