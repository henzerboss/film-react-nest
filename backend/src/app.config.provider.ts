import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';

export const APP_CONFIG = 'CONFIG';

export interface AppConfig {
  database: {
    driver: string;
    url?: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    databaseName?: string;
  };
}

export const configProvider: Provider = {
  provide: APP_CONFIG,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.get<string>('DATABASE_DRIVER', 'mongodb'),
      url: configService
        .get<string>('DATABASE_URL')
        ?.replace('localhost', '127.0.0.1'),
      host: configService.get<string>('DATABASE_HOST', 'localhost'),
      port: configService.get<number>('DATABASE_PORT', 5432),
      username: configService.get<string>('DATABASE_USERNAME', 'postgres'),
      password: configService.get<string>('DATABASE_PASSWORD', 'postgres'),
      databaseName: configService.get<string>('DATABASE_NAME', 'practicum'),
    },
  }),
};
