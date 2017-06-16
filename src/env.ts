export type Target = 'client' | 'server';
export type Mode = 'production' | 'development' | 'test';

export interface Options {
  target?: Target,
  mode?: Mode,
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
  get isTest() { return this.mode === 'test'; }
  get isCI() { return process.env.CI === 'true'; }
  get isDevelopmentClient() { return this.isDevelopment && this.isClient; }
  get isProductionClient() { return this.isProduction && this.isClient; }
  get isTestClient() { return this.isTest && this.isClient; }
  get isDevelopmentServer() { return this.isDevelopment && this.isServer; }
  get isProductionServer() { return this.isProduction && this.isServer; }
  get isTestServer() { return this.isTest && this.isServer; }
}
