import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-01T10:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('formats log as TSKV', () => {
    const logger = new TskvLogger();
    const spy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

    logger.log('hello', { a: 1 });

    expect(spy).toHaveBeenCalledTimes(1);
    const line = spy.mock.calls[0][0] as string;

    expect(line).toContain('time=2026-01-01T10:00:00.000Z');
    expect(line).toContain('level=log');
    expect(line).toContain('message=hello');
    expect(line).toContain('param0={"a":1}');
    expect(line).toContain('\t');
    expect(line.endsWith('\n')).toBe(true);
  });
});
