export default class Tasks {
  private performed: Symbol[] = [];

  hasPerformed(task: Symbol) { return this.performed.includes(task); }

  perform(task: Symbol) {
    if (this.hasPerformed(task)) {
      throw new Error(`You have already performed task ${task}`);
    }

    this.performed.push(task);
  }
}
