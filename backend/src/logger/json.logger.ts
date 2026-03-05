import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  private format(
    level: string,
    message: unknown,
    optionalParams: unknown[],
  ): string {
    return JSON.stringify({
      time: new Date().toISOString(),
      level,
      message,
      ...(optionalParams.length ? { optionalParams } : {}),
    });
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.format('log', message, optionalParams));
  }
  error(message: unknown, ...optionalParams: unknown[]) {
    console.error(this.format('error', message, optionalParams));
  }
  warn(message: unknown, ...optionalParams: unknown[]) {
    console.warn(this.format('warn', message, optionalParams));
  }
  debug(message: unknown, ...optionalParams: unknown[]) {
    console.debug(this.format('debug', message, optionalParams));
  }
  verbose(message: unknown, ...optionalParams: unknown[]) {
    console.info(this.format('verbose', message, optionalParams));
  }
}
