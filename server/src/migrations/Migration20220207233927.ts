import { Migration } from '@mikro-orm/migrations';

export class Migration20220207233927 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "file" rename column "uuid_name" to "name";');


    this.addSql('alter table "file" drop column "original_name";');
  }

}
