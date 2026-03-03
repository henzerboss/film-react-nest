import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';

function pickLogger(format: string | undefined): LoggerService {
  switch ((format || 'dev').toLowerCase()) {
    case 'json':
      return new JsonLogger();
    case 'tskv':
      return new TskvLogger();
    case 'dev':
    default:
      return new DevLogger();
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const logFormat = configService.get<string>('LOG_FORMAT') || 'dev';
  app.useLogger(pickLogger(logFormat));

  const port = Number(configService.get('PORT')) || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
