import { Migration } from '@mikro-orm/migrations';

export class Migration20210929002114 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint if exists "user_question_private_id_check";');
    this.addSql('alter table "user" alter column "question_private_id" type int4 using ("question_private_id"::int4);');
    this.addSql('alter table "user" alter column "question_private_id" drop not null;');
    this.addSql('alter table "user" drop constraint if exists "user_answer_private_check";');
    this.addSql('alter table "user" alter column "answer_private" type varchar(255) using ("answer_private"::varchar(255));');
    this.addSql('alter table "user" alter column "answer_private" drop not null;');
  }

}
