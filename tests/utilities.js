"use strict";
exports.__esModule = true;
var path = require("path");
var workspace_1 = require("../src/workspace");
var env_1 = require("../src/env");
function createWorkspace(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.root, root = _c === void 0 ? process.cwd() : _c, _d = _b.isRails, isRails = _d === void 0 ? false : _d, _e = _b.dependencies, dependencies = _e === void 0 ? {} : _e, _f = _b.devDependencies, devDependencies = _f === void 0 ? {} : _f, _g = _b.devYaml, devYaml = _g === void 0 ? {} : _g, _h = _b.plugins, plugins = _h === void 0 ? [] : _h, _j = _b.env, env = _j === void 0 ? new env_1["default"]({ target: 'client', mode: 'development' }) : _j;
    var project = new workspace_1.Project(isRails, { dependencies: dependencies, devDependencies: devDependencies }, devYaml);
    var config = { name: path.basename(root), plugins: plugins };
    var appPath = isRails ? path.join(root, 'app/ui') : path.join(root, 'app');
    var paths = {
        ownRoot: path.resolve(__dirname, '..'),
        ownNodeModules: path.resolve(__dirname, '../node_modules'),
        root: root,
        private: path.join(root, '.sewing-kit'),
        build: path.join(root, 'build'),
        nodeModules: path.join(root, 'node_modules'),
        app: appPath,
        components: path.join(appPath, 'components'),
        sections: path.join(appPath, 'sections')
    };
    return new workspace_1.Workspace(root, env, project, paths, config);
}
exports.createWorkspace = createWorkspace;
var DEFAULT_VERSIONS = {
    react: '15.0.0',
    typescript: '2.0.0',
    '@shopify/polaris': '1.0.0'
};
function createDependency(name) {
    return _a = {},
        _a[name] = DEFAULT_VERSIONS.hasOwnProperty(name)
            ? DEFAULT_VERSIONS[name]
            : '1.0.0',
        _a;
    var _a;
}
exports.createDependency = createDependency;
