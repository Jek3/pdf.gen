import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useStaticAssets(join(__dirname, '..', 'public'));

  const config = new DocumentBuilder()
    .setTitle('PDFGen Service')
    .setDescription('')
    .setVersion('1.0')
    .addTag('pdf')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const customCssUrl = '/css/swagger-theme.css';
  const customFavIcon = '/img/favicon.ico';

  SwaggerModule.setup('docs', app, document, {
  customCssUrl,
    customSiteTitle: 'PDFGen API — Docs',
    customfavIcon: customFavIcon,
    swaggerOptions: {
      docExpansion: 'list',
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
