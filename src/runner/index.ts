import {Workspace} from '../workspace';
import Logger from './logger';

export {Logger};

export default class Runner {
  private performed = new Map<Symbol, true | Workspace[]>();

  constructor(public log = new Logger()) {}

  hasPerformed(task: Symbol, workspace?: Workspace) {
    const valueForTask = this.performed.get(task);

    if (valueForTask == null) { return false; }
    if (valueForTask === true) { return true; }

    return workspace == null || valueForTask.includes(workspace);
  }

  perform(task: Symbol, workspace?: Workspace) {
    if (this.hasPerformed(task, workspace)) {
      throw new Error(`You have already performed task ${task}`);
    }

    const valueForTask = this.performed.get(task) || [];
    if (valueForTask === true) { return; }

    if (workspace == null) {
      this.performed.set(task, true);
      return;
    }

    this.performed.set(task, [...valueForTask, workspace]);
  }
}
