import { Migration } from '@mikro-orm/migrations';

export class Migration20211028034301 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "file" rename column "file_name" to "uuid_name";');


    this.addSql('alter table "file" add column "original_name" varchar(255) not null;');
  }

}
