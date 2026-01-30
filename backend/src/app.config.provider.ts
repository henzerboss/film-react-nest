import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';

export const APP_CONFIG = 'CONFIG';

export interface AppConfigDatabase {
  driver: string;
  url: string;
}

export interface AppConfig {
  database: AppConfigDatabase;
}

export const configProvider: Provider = {
  provide: APP_CONFIG,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => {
    return {
      database: {
        driver: configService.get<string>('DATABASE_DRIVER') || 'mongodb',
        url:
          configService.get<string>('DATABASE_URL') ||
          'mongodb://127.0.0.1:27017/film-nest',
      },
    };
  },
};
