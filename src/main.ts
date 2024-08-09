import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'], // Set log levels
  });
  app.enableCors();
  app.use(new LoggingMiddleware().use);

  const config = new DocumentBuilder()
    .setTitle('Cafe Payment System API')
    .setDescription('API documentation for Cafe Payment System')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('seruni-api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  Logger.log(`Server is listening on http://localhost:${port}`); // Log the port
}
bootstrap();
