import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodFilter } from './utils/zod/zod.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');
  app.useGlobalFilters(new ZodFilter());

  patchNestJsSwagger();
  const config = new DocumentBuilder()
    .setTitle('Trello API')
    .setDescription('Simple trello clone api')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document, {
    useGlobalPrefix: true,
  });

  await app.listen(3000);
}
bootstrap();
