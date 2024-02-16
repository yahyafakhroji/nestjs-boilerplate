import { BaseEntity } from '@db/entities/base.entity';
import { Entity, Property } from '@mikro-orm/core';

@Entity()
export class Todo extends BaseEntity {
  @Property()
  title!: string;

  @Property()
  description: string;
}
