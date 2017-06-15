import {resolve} from 'path';

export type Target = 'client' | 'server';
export type Mode = 'production' | 'development';

interface Options {
  target?: Target,
  mode?: Mode,
}

interface Paths {
  root: string,
}

export default class Env {
  target: Target;
  mode: Mode;

  constructor({target = 'client', mode = 'production'}: Options) {
    this.target = target;
    this.mode = mode;
  }

  get isClient() { return this.target === 'client'; }
  get isServer() { return this.target === 'server'; }
  get isProduction() { return this.mode === 'production'; }
  get isDevelopment() { return this.mode === 'development'; }
  get isDevelopmentClient() { return this.isDevelopment && this.isClient; }
  get isProductionClient() { return this.isProduction && this.isClient; }
  get isDevelopmentServer() { return this.isDevelopment && this.isServer; }
  get isProductionServer() { return this.isProduction && this.isServer; }

  ifServer<T>(then: T, or: T): T
  ifServer<T>(then: T, or: undefined): T | undefined { return this.isServer ? then : or; }

  ifClient<T>(then: T, or: T): T
  ifClient<T>(then: T, or: undefined): T | undefined { return this.isClient ? then : or; }

  ifProduction<T>(then: T, or: T): T
  ifProduction<T>(then: T, or: undefined): T | undefined { return this.isProduction ? then : or; }

  ifDevelopment<T>(then: T, or: T): T
  ifDevelopment<T>(then: T, or: undefined): T | undefined { return this.isDevelopment ? then : or; }

  ifDevelopmentClient<T>(then: T, or: T): T
  ifDevelopmentClient<T>(then: T, or: undefined): T | undefined { return this.isDevelopmentClient ? then : or; }

  ifProductionClient<T>(then: T, or: T): T
  ifProductionClient<T>(then: T, or: undefined): T | undefined { return this.isProductionClient ? then : or; }

  ifDevelopmentServer<T>(then: T, or: T): T
  ifDevelopmentServer<T>(then: T, or: undefined): T | undefined { return this.isDevelopmentServer ? then : or; }

  ifProductionServer<T>(then: T, or: T): T
  ifProductionServer<T>(then: T, or: undefined): T | undefined { return this.isProductionServer ? then : or; }
}
