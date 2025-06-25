import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  const port = process.env.PORT ?? 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
      skipUndefinedProperties: false,
      skipNullProperties: false
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors()

  await app.listen(port);
  const logger = new Logger('Bootstrap');
  logger.log(`Aplicación levantada en http://localhost:${port}`);
}
bootstrap();