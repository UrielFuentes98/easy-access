import { Migration } from '@mikro-orm/migrations';

export class Migration20211129035725 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "transfer" add column "access_id" varchar(255) not null;');
  }

}
