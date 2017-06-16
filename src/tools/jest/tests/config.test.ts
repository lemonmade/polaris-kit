import * as path from 'path';
import {createWorkspace} from 'tests/utilities';

import jestConfig from '../config';
import * as plugins from '../../../plugins';

const jestPath = path.resolve(__dirname, '../../../../jest');
const jestTransformPath = path.join(jestPath, 'transformers');

describe('jestConfig()', () => {
  describe('rootDir', () => {
    it('uses the root of the workspace', async () => {
      const workspace = createWorkspace();
      expect(await jestConfig(workspace)).toHaveProperty('rootDir', workspace.root);
    });
  });

  describe('setupFiles', () => {
    it('includes the polyfills file', async () => {
      expect(await jestConfig(createWorkspace())).toHaveProperty('setupFiles', [
        path.join(jestPath, 'polyfills.js'),
      ]);
    });

    it('includes a custom setup run file', async () => {
      const setupRun = path.resolve(__dirname, 'setup-my-tests.tsx');
      const workspace = createWorkspace({
        plugins: [
          plugins.jest({setupRun})
        ],
      });

      expect(await jestConfig(workspace)).toHaveProperty('setupFiles', [
        path.join(jestPath, 'polyfills.js'),
        setupRun,
      ]);
    });
  });

  describe('setupTestFrameworkScriptFile', () => {
    it('includes a custom setup test file', async () => {
      const setupTest = path.resolve(__dirname, 'before-each.js');
      const workspace = createWorkspace({
        plugins: [
          plugins.jest({setupTest})
        ],
      });

      expect(await jestConfig(workspace)).toHaveProperty('setupTestFrameworkScriptFile', setupTest);
    });
  });

  describe('testRegex', () => {
    it('matches all .test files', async () => {
      expect(await jestConfig(createWorkspace())).toHaveProperty('testRegex', '.*\\.(test|integration)\\.(js|ts)x?$');
    });
  });

  describe('transform', () => {
    it('adds suitable transforms for all file types', async () => {
      expect(await jestConfig(createWorkspace())).toHaveProperty('transform', {
        '\\.(jpg|jpeg|png|gif|svg|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': path.join(jestTransformPath, 'file.js'),
        '\\.tsx?$': path.join(jestTransformPath, 'typescript.js'),
        '\\.jsx?$': path.join(jestTransformPath, 'javascript.js'),
      });
    });

    it('adds the custom SVG transform when using Polaris', async () => {
      expect(await jestConfig(createWorkspace({
        dependencies: {'@shopify/polaris': '1.0.0'},
      }))).toHaveProperty('transform', {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': path.join(jestTransformPath, 'file.js'),
        '\\.svg$': path.join(jestTransformPath, 'svg.js'),
        '\\.tsx?$': path.join(jestTransformPath, 'typescript.js'),
        '\\.jsx?$': path.join(jestTransformPath, 'javascript.js'),
      });
    });
  });

  describe('moduleNameMapper', () => {
    it('adds a mapping for CSS and Sass files', async () => {
      expect(await jestConfig(createWorkspace())).toHaveProperty('moduleNameMapper', {
        '\\.s?css$': path.join(jestTransformPath, 'styles.js'),
      });
    });
  });
});
