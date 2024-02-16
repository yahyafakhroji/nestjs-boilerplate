import { Migration } from '@mikro-orm/migrations';

export class Migration20240216110849_add_todo_table extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `todo` (`id` varchar(255) not null, `created_at` datetime(3) not null, `updated_at` datetime(3) not null, `title` varchar(255) not null, `description` varchar(255) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;'
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `todo`;');
  }
}
