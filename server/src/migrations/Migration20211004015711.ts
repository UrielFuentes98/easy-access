import { Migration } from '@mikro-orm/migrations';

export class Migration20211004015711 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "transfer" ("id" serial primary key, "phrase" varchar(255) not null, "duration_secs" int4 not null, "owner_id" int4 not null, "is_private" bool not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('alter table "transfer" add constraint "transfer_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');
  }

}
