import { Migration } from '@mikro-orm/migrations';

export class Migration20211011024933 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "transfer" rename column "duration_secs" to "duration";');
  }

}
