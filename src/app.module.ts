import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { mikroorm } from '@config/orm.config';
import { MikroORM } from '@mikro-orm/core';
import { RequestContext } from '@lib/mikroorm/request.context';

@Module({
  imports: [MikroOrmModule.forRoot(mikroorm)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private orm: MikroORM) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const parse = require('url').parse(req.url, { parseQueryString: true });
        const queries = JSON.parse(JSON.stringify(parse.query));
        RequestContext.create(this.orm.em, queries, next);
      })
      .forRoutes('*');
  }
}
