import fastifyCompress from '@fastify/compress';
import fastifyHelmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import { handlebars } from '@lib/handlebars/adapter.library';
import { config } from '@lib/helpers/config.helper';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';
import { Transformer } from '@lib/transformer/main.transformer';
import { HttpStatus } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import * as Fastify from 'fastify';
import * as fs from 'fs';

export class Adapter extends FastifyAdapter {
  private fsInstance: Fastify.FastifyInstance;

  constructor(fastify?: any) {
    super(fastify);

    this.fsInstance = fastify;

    this.decorateRequest();
    this.decorateReply();
    this.adapterRegister();
    this.hookRegister();
    this.parserRegister();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  decorateRequest() {}

  decorateReply() {
    this.fsInstance.decorateReply(
      'item',
      async function (entity: any, transformer: TransformerAbstract, status: number = HttpStatus.OK) {
        const instance = Transformer.create().withContext(this);
        const result = await instance.item(entity, transformer);
        this.status(status).send({ success: true, request_id: this.request.id, result });
      }
    );

    this.fsInstance.decorateReply(
      'collection',
      async function (entities: any[], transformer: TransformerAbstract, status: number = HttpStatus.OK) {
        const instance = Transformer.create().withContext(this);
        const result = await instance.collection(entities, transformer);
        this.status(status).send({ success: true, request_id: this.request.id, result });
      }
    );

    this.fsInstance.decorateReply(
      'paginate',
      async function (entity: any, transformer: TransformerAbstract, status: number = HttpStatus.OK) {
        const instance = Transformer.create().withContext(this);
        const result = await instance.paginate(entity, transformer);
        this.status(status).send({ success: true, request_id: this.request.id, result });
      }
    );

    this.fsInstance.decorateReply('data', function (result: any, status: number = HttpStatus.OK) {
      return this.status(status).send({ success: true, request_id: this.request.id, result });
    });

    this.fsInstance.decorateReply('noContent', function () {
      return this.status(HttpStatus.NO_CONTENT).send();
    });

    this.fsInstance.decorateReply('render', function (template: string, content: any = {}, status: number = HttpStatus.OK) {
      const path = template.replace('.', '/');
      const html = fs.readFileSync(`${config.getTemplatePath()}/${path}.hbs`, 'utf8');
      const compiled = handlebars.compile(html)(content);

      return this.status(status).type('text/html').send(compiled);
    });
  }

  adapterRegister() {
    this.fsInstance.register(fastifyCompress);
    this.fsInstance.register(fastifyHelmet, {
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    });
    // this.fsInstance.register(fastifyRateLimit, {
    //   max: 1000,
    //   timeWindow: '1 minute',
    // });
    this.fsInstance.register(fastifyMultipart, {
      attachFieldsToBody: true,
      limits: {
        fieldNameSize: 100, // Max field name size in bytes
        fieldSize: 1000000, // Max field value size in bytes
        fields: 10, // Max number of non-file fields
        // fileSize: 100, // For multipart forms, the max file size
        files: 1, // Max number of file fields
        headerPairs: 2000, // Max number of header key=>value pairs
      },
    });

    // this.fsInstance.register(fastifyRequestContext, {
    //   defaultStoreValues: {
    //     query: {},
    //   },
    // });
  }

  hookRegister() {
    // this.fsInstance.addHook('onRequest', (req, reply, done) => {
    //   // eslint-disable-next-line @typescript-eslint/no-var-requires
    //   const parse = require('url').parse(req.url, { parseQueryString: true });
    //   const queries = JSON.parse(JSON.stringify(parse.query));
    //
    //   RequestContext.create(orm.em, next);
    //   // req.requestContext.set('query', queries);
    //   console.log(queries);
    //   done();
    // });
  }

  parserRegister() {
    this.fsInstance.addContentTypeParser('application/webhook+json', function (req, payload, done) {
      let data = '';
      payload.on('data', (chunk) => {
        data += chunk;
      });
      payload.on('end', () => {
        done(null, JSON.parse(data));
      });
    });
  }
}
