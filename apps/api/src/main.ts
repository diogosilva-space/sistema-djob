import * as dotenv from 'dotenv';
import * as path from 'path';
// Carrega o .env da raiz do monorepo
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({
    origin: ['http://localhost:3000', 'https://app.djob.com.br'],
    credentials: true,
  });

  // Prefixo global para todas as rotas
  app.setGlobalPrefix('api');

  // A validação via Zod será feita via ZodValidationPipe. Não usaremos o ValidationPipe do Nest.

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('D.job System API')
    .setDescription('API REST para o ERP/CRM D.job System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3001, '0.0.0.0');
  console.log('API rodando em: http://127.0.0.1:3001');
}
// trigger reload
bootstrap();
