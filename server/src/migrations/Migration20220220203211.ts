import { Migration } from '@mikro-orm/migrations';

export class Migration20220220203211 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "transfer" add column "is_de_activated" bool not null;');
  }

}
