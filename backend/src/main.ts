import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ==========================
  // CORS
  // ==========================

  const frontendUrl =
    process.env.FRONTEND_URL ??
    'http://localhost:4200';

  app.enableCors({
    origin: frontendUrl,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ==========================
  // PUERTO
  // ==========================

  const port =
    process.env.PORT ?? 3000;

  await app.listen(port);
}
bootstrap();
