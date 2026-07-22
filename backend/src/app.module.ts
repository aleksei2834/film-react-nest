import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';

import { configProvider } from './app.config.provider';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const connectionUrl = new URL(
      configService.get<string>(
        'DATABASE_URL',
        'postgres://localhost:5432/films',
      ),
    );
    connectionUrl.username = configService.get<string>(
      'DATABASE_USERNAME',
      '',
    );
    connectionUrl.password = configService.get<string>(
      'DATABASE_PASSWORD',
      '',
    );

    return {
      type: 'postgres' as const,
      url: connectionUrl.toString(),
      autoLoadEntities: true,
      synchronize: false,
    };
  },
}),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    FilmsModule,
    OrderModule,
  ],
  providers: [configProvider],
})
export class AppModule {}
