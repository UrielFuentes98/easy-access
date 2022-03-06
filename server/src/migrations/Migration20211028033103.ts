import { Migration } from '@mikro-orm/migrations';

export class Migration20211028033103 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "file" ("id" serial primary key, "file_name" varchar(255) not null, "file_transfer_id" int4 not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('alter table "file" add constraint "file_file_transfer_id_foreign" foreign key ("file_transfer_id") references "transfer" ("id") on update cascade;');
  }

}
