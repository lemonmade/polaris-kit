let mockJestConfig = jest.fn(() => Promise.resolve({}));
let mockJest = jest.fn();
jest.mock('jest', () => ({run: mockJest}));
jest.mock('../config', () => ({default: mockJestConfig}));

import {createWorkspace} from 'tests/utilities';
import runJest from '..';

const originalBabelEnv = process.env.BABEL_ENV;
const originalNodeEnv = process.env.BABEL_ENV;
const originalCI = process.env.CI;

describe('jest()', () => {
  beforeEach(() => {
    mockJestConfig.mockClear();
    mockJest.mockClear();

    process.env.BABEL_ENV = originalBabelEnv;
    process.env.NODE_ENV = originalNodeEnv;
    process.env.CI = 'false';
  });

  afterEach(() => {
    process.env.CI = originalCI;
  });

  it('creates a config from the passed workspace and includes it as --config', async () => {
    const workspace = createWorkspace();
    const config = {foo: 'bar'};
    mockJestConfig.mockReturnValue(config);

    await runJest(workspace);

    const args = mockJest.mock.calls[0][0];
    expect(mockJestConfig).toHaveBeenCalledWith(workspace);
    expect(args[0]).toBe('--config');
    expect(args[1]).toBe(JSON.stringify(config));
  });

  it('does not include a --watch flag by default', async () => {
    await runJest(createWorkspace());
    expect(mockJest.mock.calls[0][0].includes('--watch')).toBe(false);
  });

  it('does not include a --watch when watch is true', async () => {
    await runJest(createWorkspace(), {watch: true});
    expect(mockJest.mock.calls[0][0].includes('--watch')).toBe(true);
  });

  it('does not include a --watch when we are in CI', async () => {
    process.env.CI = 'true';
    await runJest(createWorkspace(), {watch: true});
    expect(mockJest.mock.calls[0][0].includes('--watch')).toBe(false);
  });

  it('does not run in band by default', async () => {
    await runJest(createWorkspace());
    expect(mockJest.mock.calls[0][0].includes('--runInBand')).toBe(false);
  });

  it('runs in band for CI', async () => {
    process.env.CI = 'true';
    await runJest(createWorkspace());
    expect(mockJest.mock.calls[0][0].includes('--runInBand')).toBe(true);
  });
});
