import Env from '../env';

import loadConfig, {Config} from './config';
import loadProject, {Project} from './project';
import loadPaths, {Paths} from './paths';

export {Config, Project};

export class Workspace {
  get name() {
    return this.config.name;
  }

  constructor(
    public root: string,
    public env: Env,
    public project: Project,
    public paths: Paths,
    public config: Config,
  ) {}

  duplicate(env: Env = this.env) {
    return new Workspace(
      this.root,
      env,
      this.project,
      this.paths,
      this.config,
    );
  }
}

export default async function loadWorkspace(env = new Env({target: 'client', mode: 'development'})) {
  const root = process.cwd();

  const [config, project] = await Promise.all([
    loadConfig(root, env),
    loadProject(root)
  ]);

  const paths = await loadPaths(root, project);
  return new Workspace(root, env, project, paths, config);
}
