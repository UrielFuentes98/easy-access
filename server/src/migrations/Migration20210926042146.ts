import { Migration } from '@mikro-orm/migrations';

export class Migration20210926042146 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "question" ("id" serial primary key, "question" varchar(255) not null);');

    this.addSql('create table "user" ("id" serial primary key, "email" varchar(255) not null, "issuer" varchar(255) not null, "last_login" int4 not null, "question_private_id" int4 not null, "answer_private" varchar(255) not null, "question_public_id" int4 null, "answer_public" varchar(255) null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('alter table "user" add constraint "user_question_private_id_foreign" foreign key ("question_private_id") references "question" ("id") on update cascade;');
    this.addSql('alter table "user" add constraint "user_question_public_id_foreign" foreign key ("question_public_id") references "question" ("id") on update cascade on delete set null;');
  }

}
