import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as multer from 'multer';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.enableCors();

  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  app.use(multer().single('gambarMenu')); // Pastikan nama field sesuai
  const config = new DocumentBuilder()
    .setTitle('Cafe Payment System API')
    .setDescription('API documentation for Cafe Payment System')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('seruni-api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
