// backend/src/logger/tskv.logger.spec.ts
import { TskvLogger } from './tskv.logger';

function parseTskv(line: string): Record<string, string> {
  return Object.fromEntries(
    line.split('\t').map((pair) => {
      const [key, ...rest] = pair.split('=');
      return [key, rest.join('=')];
    }),
  );
}

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let logSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    errorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('should format a log message as tab-separated key=value pairs', () => {
    logger.log('server started');

    const output = logSpy.mock.calls[0][0] as string;
    const fields = parseTskv(output);

    expect(fields.level).toBe('log');
    expect(fields.message).toBe('server started');
  });

  it('should set the correct level for each log method', () => {
    logger.warn('careful');
    const fields = parseTskv(warnSpy.mock.calls[0][0] as string);

    expect(fields.level).toBe('warn');
  });

  it('should separate every field with a tab character', () => {
    logger.log('hello');
    const output = logSpy.mock.calls[0][0] as string;

    expect(output).toContain('\t');
    expect(output).not.toContain('\n');
  });

  it('should escape tab and newline characters inside the message', () => {
    logger.log('bad\tmessage\nwith control chars');

    const output = logSpy.mock.calls[0][0] as string;
    const fields = parseTskv(output);

    expect(fields.message).not.toMatch(/[\t\n]/);
  });

  it('should include a timestamp field', () => {
    logger.log('with time');
    const fields = parseTskv(logSpy.mock.calls[0][0] as string);

    expect(fields.timestamp).toBeDefined();
    expect(() => new Date(fields.timestamp)).not.toThrow();
  });
});