import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from '@lib/helpers/config.helper';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { InstanceFastify } from '@lib/fastify/instance.fastify';
import { ExceptionFilter } from '@core/filters/exception.filter';
import { join } from 'path';
import { handlebars } from '@lib/handlebars/adapter.library';
import { WinstonLogger } from '@lib/logger/winston.logger';

async function bootstrap() {
  const fastify = new InstanceFastify();
  const httpAdapter = await fastify.init();

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, httpAdapter, {
    logger: WinstonLogger,
  });

  // ============== Middleware ==============
  app.useGlobalFilters(new ExceptionFilter());

  // ============== enable CORS ==============
  app.enableCors({ origin: config.getOrigin() });

  // ============== set static assets ==============
  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/assets/',
  });

  // ============== set handlebars ==============
  app.setViewEngine({
    engine: { handlebars },
    templates: join(__dirname, '..', 'templates'),
  });

  await app.listen(Number(config.getPort()), '0.0.0.0');
}
bootstrap();
