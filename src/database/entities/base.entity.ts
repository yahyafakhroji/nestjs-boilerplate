import { monotonic } from '@lib/uid/ulid.library';
import { Entity, PrimaryKey, Property, ref, serialize as Serialize } from '@mikro-orm/core';

@Entity({ abstract: true })
export abstract class BaseEntity {
  @PrimaryKey()
  id: string = monotonic();

  @Property({ columnType: 'datetime(3)' })
  created_at: Date = new Date();

  @Property({
    columnType: 'datetime(3)',
    onUpdate: () => new Date(),
  })
  updated_at: Date = new Date();

  // // =============== METHODS ===============
  serialize() {
    return Serialize(this);
  }

  refer() {
    return ref(this);
  }
}
