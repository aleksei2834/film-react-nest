import { ConfigService } from '@nestjs/config';

export const CONFIG = 'CONFIG';

export interface AppConfigDatabase {
  driver: string;
  url: string;
}

export interface AppConfig {
  database: AppConfigDatabase;
}

export const configProvider = {
  provide: CONFIG,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.get<string>('DATABASE_DRIVER', 'mongodb'),
      url: configService.get<string>(
        'DATABASE_URL',
        'mongodb://localhost:27017/',
      ),
    },
  }),
};
