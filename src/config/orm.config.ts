import { config } from '@lib/helpers/config.helper';
import { RequestContext } from '@lib/mikroorm/request.context';
import { Migrator } from '@mikro-orm/migrations';
import { MySqlDriver } from '@mikro-orm/mysql';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs/typings';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Logger } from '@nestjs/common';

export const mikroorm: MikroOrmModuleSyncOptions = {
  driver: MySqlDriver,
  host: config.get('DATABASE_MASTER_HOST'),
  port: config.get('DATABASE_PORT'),
  user: config.get('DATABASE_USER'),
  password: config.get('DATABASE_PASSWORD'),
  dbName: config.get('DATABASE_NAME'),
  baseDir: __dirname + '/../..',
  entities: ['./dist/database/entities/**/*.entity.js'],
  entitiesTs: ['./src/database/entities/**/*.entity.ts'],
  debug: true,
  logger: (msg) => new Logger('MikroORM').log(msg),
  highlighter: new SqlHighlighter(),
  metadataProvider: TsMorphMetadataProvider,
  extensions: [Migrator],
  migrations: {
    tableName: 'migrations',
    path: './dist/database/migrations',
    pathTs: './src/database/migrations',
    snapshot: false,
    transactional: true,
    allOrNothing: true,
  },
  registerRequestContext: false,
  context: () => RequestContext.getEntityManager(),
} as any;
