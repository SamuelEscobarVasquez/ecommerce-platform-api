import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './modules/users/users.module';
import configuration from './config/configuration';
import { SharedModule } from './shared/shared.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ProductsModule } from './modules/products/products.module';


@Module({
  imports: [
    // Carga .env y vuelve ConfigService global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration]
    }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (cfg: ConfigService) => ({
        dialect: 'mysql',
        host: cfg.get<string>('DB_HOST'),
        port: cfg.get<number>('DB_PORT'),
        username: cfg.get<string>('DB_USER'),
        password: cfg.get<string>('DB_PASS'),
        database: cfg.get<string>('DB_NAME'),
        aws_access_key_id: cfg.get<string>('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key: cfg.get<string>('AWS_SECRET_ACCESS_KEY'),
        aws_region: cfg.get<string>('AWS_REGION'),
        aws_bucket_name: cfg.get<string>('AWS_BUCKET_NAME'),
        autoLoadModels: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    SharedModule,
    UsersModule,
    ProductsModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }