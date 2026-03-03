import { Injectable, LoggerService } from '@nestjs/common';

function toScalarString(v: unknown): string {
  if (v === null) return 'null';
  if (v === undefined) return 'undefined';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean' || typeof v === 'bigint')
    return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function esc(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/\t/g, '\\t')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

@Injectable()
export class TskvLogger implements LoggerService {
  private format(
    level: string,
    message: unknown,
    optionalParams: unknown[],
  ): string {
    const parts: string[] = [
      `time=${esc(new Date().toISOString())}`,
      `level=${esc(level)}`,
      `message=${esc(toScalarString(message))}`,
    ];
    optionalParams.forEach((p, i) =>
      parts.push(`param${i}=${esc(toScalarString(p))}`),
    );
    return `${parts.join('\t')}\n`;
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
