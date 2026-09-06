import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should log a message as a valid JSON string', () => {
    logger.log('hello world');

    const output = consoleSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(output);

    expect(parsed).toMatchObject({ level: 'log', message: 'hello world' });
  });
});