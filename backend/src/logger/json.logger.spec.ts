import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-01T10:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('formats log as JSON', () => {
    const logger = new JsonLogger();
    const spy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

    logger.log('hello', { a: 1 }, 2);

    expect(spy).toHaveBeenCalledTimes(1);
    const payload = spy.mock.calls[0][0] as string;
    const parsed = JSON.parse(payload);

    expect(parsed.time).toBe('2026-01-01T10:00:00.000Z');
    expect(parsed.level).toBe('log');
    expect(parsed.message).toBe('hello');
    expect(parsed.optionalParams).toEqual([{ a: 1 }, 2]);
  });

  it('writes error to console.error', () => {
    const logger = new JsonLogger();
    const spy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    logger.error('boom');

    expect(spy).toHaveBeenCalledTimes(1);
    const payload = spy.mock.calls[0][0] as string;
    expect(JSON.parse(payload).level).toBe('error');
  });
});
