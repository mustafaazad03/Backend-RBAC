import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 👈 Automatically remove properties that don't belong to the DTO
      forbidNonWhitelisted: true, // 👈 Throw an error when whitelisted properties are detected
      transform: true, // 👈 Automatically transform payloads to DTO class instances
    }),
  ); // 👈 Validate request payloads data automatically
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  }); // 👈 Enable cross origin for interaction of frontend from the backend
  await app.listen(4004);
}
bootstrap();
